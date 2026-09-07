/**
 * Neural-OS Kernel Orchestration Engine
 * ------------------------------------
 * Core runtime for the Neural-OS sector of PUB CORE holding.
 * Responsibilities:
 *   - Topology discovery & registration of neural nodes
 *   - Priority-based task scheduling across the mesh
 *   - Health monitoring with self-healing re-routing
 *   - Telemetry & event bus for downstream squads
 *
 * Designed to run as a singleton within the autonomous squad pipeline.
 */

export type NodeTier = 'core' | 'edge' | 'leaf';
export type NodeStatus = 'idle' | 'busy' | 'degraded' | 'offline';

export interface NeuralNode {
  id: string;
  tier: NodeTier;
  region: string;
  capacity: number; // 0..1
  status: NodeStatus;
  lastHeartbeat: number;
  workload: number;
  tags: string[];
}

export interface NeuralTask {
  id: string;
  payload: unknown;
  priority: number; // higher = sooner
  requiresTags: string[];
  submittedAt: number;
  attempts: number;
  maxAttempts: number;
}

export interface DispatchResult {
  taskId: string;
  nodeId: string;
  dispatchedAt: number;
}

export interface KernelEvent {
  type:
    | 'node:registered'
    | 'node:degraded'
    | 'node:recovered'
    | 'task:dispatched'
    | 'task:retrying'
    | 'task:dropped'
    | 'tick';
  payload: Record<string, unknown>;
  ts: number;
}

type Listener = (event: KernelEvent) => void;

const HEARTBEAT_TIMEOUT_MS = 15_000;
const HEARTBEAT_SWEEP_MS = 3_000;

export class NeuralKernelOrchestrator {
  private nodes = new Map<string, NeuralNode>();
  private queue: NeuralTask[] = [];
  private listeners = new Set<Listener>();
  private sweepTimer: ReturnType<typeof setInterval> | null = null;
  private metrics = {
    dispatched: 0,
    retries: 0,
    drops: 0,
    healings: 0,
  };

  constructor(private readonly opts: { sweepMs?: number } = {}) {
    this.startSweep();
  }

  // ---- Event Bus ----------------------------------------------------------

  on(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(type: KernelEvent['type'], payload: Record<string, unknown>): void {
    const evt: KernelEvent = { type, payload, ts: Date.now() };
    for (const l of this.listeners) {
      try {
        l(evt);
      } catch {
        /* listener errors must not break the kernel */
      }
    }
  }

  // ---- Topology ----------------------------------------------------------

  registerNode(node: Omit<NeuralNode, 'status' | 'lastHeartbeat' | 'workload'>): NeuralNode {
    const full: NeuralNode = {
      ...node,
      status: 'idle',
      lastHeartbeat: Date.now(),
      workload: 0,
    };
    this.nodes.set(full.id, full);
    this.emit('node:registered', { id: full.id, tier: full.tier, region: full.region });
    return full;
  }

  heartbeat(id: string, capacityHint?: number): void {
    const n = this.nodes.get(id);
    if (!n) return;
    n.lastHeartbeat = Date.now();
    if (typeof capacityHint === 'number') n.capacity = clamp01(capacityHint);
    if (n.status === 'degraded' || n.status === 'offline') {
      n.status = 'idle';
      this.emit('node:recovered', { id });
    }
  }

  // ---- Task submission -----------------------------------------------------

  submit(task: Omit<NeuralTask, 'id' | 'submittedAt' | 'attempts'>): string {
    const id = `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    const full: NeuralTask = {
      ...task,
      id,
      submittedAt: Date.now(),
      attempts: 0,
    };
    this.queue.push(full);
    this.queue.sort((a, b) => b.priority - a.priority);
    return id;
  }

  // ---- Scheduling ----------------------------------------------------------

  /**
   * Picks the best available node for a task using a weighted score:
   *   score = (capacity * 0.6) + ((1 - workload) * 0.4)
   * Tier weights: core > edge > leaf.
   */
  resolveTarget(task: NeuralTask): NeuralNode | null {
    const candidates = [...this.nodes.values()].filter(
      (n) =>
        n.status !== 'offline' &&
        task.requiresTags.every((t) => n.tags.includes(t)),
    );
    if (candidates.length === 0) return null;

    const tierWeight = (t: NodeTier): number =>
      t === 'core' ? 1.0 : t === 'edge' ? 0.7 : 0.4;

    let best: { node: NeuralNode; score: number } | null = null;
    for (const n of candidates) {
      const base = n.capacity * 0.6 + (1 - n.workload) * 0.4;
      const score = base * tierWeight(n.tier);
      if (!best || score > best.score) best = { node: n, score };
    }
    return best?.node ?? null;
  }

  tick(): DispatchResult[] {
    const results: DispatchResult[] = [];
    const stillQueued: NeuralTask[] = [];
    const now = Date.now();

    for (const task of this.queue) {
      const node = this.resolveTarget(task);
      if (!node) {
        task.attempts += 1;
        if (task.attempts >= task.maxAttempts) {
          this.metrics.drops += 1;
          this.emit('task:dropped', { taskId: task.id, reason: 'no-target' });
          continue;
        }
        this.metrics.retries += 1;
        this.emit('task:retrying', { taskId: task.id, attempt: task.attempts });
        stillQueued.push(task);
        continue;
      }

      node.status = 'busy';
      node.workload = clamp01(node.workload + 0.15);
      this.metrics.dispatched += 1;
      const result: DispatchResult = {
        taskId: task.id,
        nodeId: node.id,
        dispatchedAt: now,
      };
      results.push(result);
      this.emit('task:dispatched', { taskId: task.id, nodeId: node.id });
    }

    this.queue = stillQueued;
    this.emit('tick', { dispatched: results.length, queued: this.queue.length });
    return results;
  }

  completeTask(nodeId: string): void {
    const n = this.nodes.get(nodeId);
    if (!n) return;
    n.workload = clamp01(n.workload - 0.2);
    if (n.workload < 0.05 && n.status === 'busy') n.status = 'idle';
  }

  // ---- Self-healing --------------------------------------------------------

  private startSweep(): void {
    if (this.sweepTimer) return;
    const interval = this.opts.sweepMs ?? HEARTBEAT_SWEEP_MS;
    this.sweepTimer = setInterval(() => this.sweepHeartbeats(), interval);
    if (typeof this.sweepTimer === 'object' && 'unref' in this.sweepTimer) {
      (this.sweepTimer as { unref?: () => void }).unref?.();
    }
  }

  private sweepHeartbeats(): void {
    const now = Date.now();
    for (const n of this.nodes.values()) {
      const stale = now - n.lastHeartbeat;
      if (stale > HEARTBEAT_TIMEOUT_MS && n.status !== 'offline') {
        const wasBusy = n.status === 'busy' || n.status === 'idle';
        n.status = 'offline';
        n.workload = 0;
        if (wasBusy) {
          this.metrics.healings += 1;
          this.emit('node:degraded', { id: n.id, reason: 'heartbeat-timeout' });
        }
      } else if (stale > HEARTBEAT_TIMEOUT_MS / 2 && n.status === 'idle') {
        n.status = 'degraded';
      }
    }
  }

  // ---- Introspection -------------------------------------------------------

  snapshot() {
    return {
      nodes: [...this.nodes.values()].map((n) => ({ ...n })),
      queueDepth: this.queue.length,
      metrics: { ...this.metrics },
    };
  }

  shutdown(): void {
    if (this.sweepTimer) {
      clearInterval(this.sweepTimer);
      this.sweepTimer = null;
    }
    this.listeners.clear();
    this.queue = [];
    this.nodes.clear();
  }
}

function clamp01(v: number): number {
  if (Number.isNaN(v)) return 0;
  if (v < 0) return 0;
  if (v > 1) return 1;
  return v;
}

// ---- Singleton wiring for the Kernel sector --------------------------------

declare global {
  // eslint-disable-next-line no-var
  var __neuralKernel: NeuralKernelOrchestrator | undefined;
}

export function getNeuralKernel(): NeuralKernelOrchestrator {
  if (!globalThis.__neuralKernel) {
    globalThis.__neuralKernel = new NeuralKernelOrchestrator();
  }
  return globalThis.__neuralKernel;
}

export default getNeuralKernel;
