import type { KnowledgeRecord } from "./entities";

export function nextVersion(current?: string) {
  if (!current) return "1.0.0";
  const parts = current.split(".").map(Number);
  const patch = Number.isFinite(parts[2]) ? parts[2] + 1 : 1;
  return `${parts[0] || 1}.${parts[1] || 0}.${patch}`;
}

export function canAccess(record: KnowledgeRecord, visibility?: string) {
  const levelOrder = ["PUBLIC", "INTERNAL", "CONFIDENTIAL", "RESTRICTED"] as const;
  const recordIndex = levelOrder.indexOf((record.permissions?.[0] as (typeof levelOrder)[number]) || "PUBLIC");
  const userIndex = levelOrder.indexOf((visibility as (typeof levelOrder)[number]) || "PUBLIC");
  return userIndex >= recordIndex;
}
