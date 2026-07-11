import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring, type Variants } from "motion/react";
import {
  ArrowRight,
  Brain,
  Network,
  Layers,
  Sparkles,
  Workflow,
  Database,
  Shield,
  MessagesSquare,
  Clock,
  FileStack,
  Users,
  Building2,
  ChevronDown,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: NeuralOSLanding,
});

/* -------------------------------------------------------------------------- */
/*  Utilities                                                                 */
/* -------------------------------------------------------------------------- */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] },
  }),
};

function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const MotionTag = motion(Tag as never);
  return (
    <MotionTag
      // @ts-expect-error ref forwarding to arbitrary tag
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      custom={delay}
      variants={fadeUp}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

/* -------------------------------------------------------------------------- */
/*  Magnetic Button                                                           */
/* -------------------------------------------------------------------------- */

function MagneticButton({
  children,
  variant = "primary",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx * 0.25);
    y.set(dy * 0.25);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    "group relative inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors will-change-transform";
  const styles =
    variant === "primary"
      ? "bg-foreground text-background hover:bg-white/90"
      : "hairline text-foreground/90 hover:text-foreground hover:bg-white/5";

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={`${base} ${styles} ${className}`}
    >
      {children}
    </motion.button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Neural Network Canvas (hero background)                                   */
/* -------------------------------------------------------------------------- */

function NeuralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type Node = { x: number; y: number; vx: number; vy: number; r: number };
    let nodes: Node[] = [];

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(80, Math.floor((width * height) / 16000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.4 + 0.6,
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.current.x = -9999;
      mouse.current.y = -9999;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      // subtle vignette
      const grad = ctx.createRadialGradient(width / 2, height * 0.2, 0, width / 2, height * 0.2, Math.max(width, height));
      grad.addColorStop(0, "rgba(80,140,255,0.06)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // update
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        const dxm = n.x - mouse.current.x;
        const dym = n.y - mouse.current.y;
        const dm = Math.hypot(dxm, dym);
        if (dm < 160) {
          n.x += (dxm / dm) * 0.6;
          n.y += (dym / dm) * 0.6;
        }
      }

      // links
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < 140) {
            const alpha = (1 - d / 140) * 0.35;
            ctx.strokeStyle = `rgba(120,180,255,${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // nodes
      for (const n of nodes) {
        ctx.beginPath();
        ctx.fillStyle = "rgba(200,220,255,0.9)";
        ctx.shadowColor = "rgba(90,150,255,0.9)";
        ctx.shadowBlur = 8;
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />;
}

/* -------------------------------------------------------------------------- */
/*  Nav                                                                       */
/* -------------------------------------------------------------------------- */

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <div
          className={`flex items-center justify-between gap-6 rounded-full px-4 py-2.5 transition-all duration-500 ${
            scrolled ? "glass w-full md:w-auto md:min-w-[520px]" : "w-full md:w-auto"
          }`}
        >
          <a href="#" className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-white to-white/40 text-background">
              <Brain className="h-4 w-4" />
            </span>
            <span className="font-display text-sm font-semibold tracking-tight">Neural OS</span>
          </a>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#produto" className="hover:text-foreground">Produto</a>
            <a href="#como" className="hover:text-foreground">Como funciona</a>
            <a href="#casos" className="hover:text-foreground">Casos</a>
            <a href="#faq" className="hover:text-foreground">FAQ</a>
          </nav>
          <MagneticButton variant="primary" className="!px-4 !py-2 text-xs">
            Solicitar demonstração <ArrowRight className="h-3.5 w-3.5" />
          </MagneticButton>
        </div>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero                                                                      */
/* -------------------------------------------------------------------------- */

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative isolate overflow-hidden pt-40 pb-32 md:pt-56 md:pb-48">
      {/* Backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="grid-bg absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <NeuralCanvas />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
      </div>

      <motion.div style={{ y, opacity }} className="mx-auto max-w-6xl px-6 text-center">
        <Reveal>
          <div className="mx-auto inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-muted-foreground">
            <span className="grid h-1.5 w-1.5 place-items-center rounded-full bg-[color:var(--electric)] shadow-[0_0_10px_var(--electric)]" />
            Uma nova categoria de software corporativo
          </div>
        </Reveal>

        <Reveal delay={1} className="mt-8">
          <h1 className="text-balance font-display text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl lg:text-[88px]">
            <span className="text-gradient">Sua empresa já tem pessoas.</span>
            <br />
            <span className="text-electric-gradient">Agora ela ganha um cérebro.</span>
          </h1>
        </Reveal>

        <Reveal delay={2} className="mx-auto mt-8 max-w-2xl">
          <p className="text-pretty text-lg text-muted-foreground md:text-xl">
            Neural OS é o sistema operacional que faz sua empresa lembrar, entender e
            decidir — sem depender da memória das pessoas.
          </p>
        </Reveal>

        <Reveal delay={3} className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <MagneticButton variant="primary">
            Solicitar demonstração <ArrowRight className="h-4 w-4" />
          </MagneticButton>
          <MagneticButton variant="ghost">Ver como funciona</MagneticButton>
        </Reveal>

        <Reveal delay={5} className="mt-24 flex flex-col items-center gap-3 text-xs text-muted-foreground">
          <span>Role para descobrir</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </Reveal>
      </motion.div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Analogy strip                                                             */
/* -------------------------------------------------------------------------- */

function Analogy() {
  const items = [
    { label: "Windows", sub: "organiza computadores" },
    { label: "iOS", sub: "organiza iPhones" },
    { label: "Neural OS", sub: "organiza empresas", accent: true },
  ];
  return (
    <section className="relative border-y hairline py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={it.label} delay={i}>
              <div className="flex flex-col gap-1">
                <span
                  className={`font-display text-2xl font-semibold tracking-tight md:text-3xl ${
                    it.accent ? "text-electric-gradient" : "text-foreground"
                  }`}
                >
                  {it.label}
                </span>
                <span className="text-sm text-muted-foreground">{it.sub}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Problem section (chaos)                                                   */
/* -------------------------------------------------------------------------- */

function Problem() {
  const pains = [
    "Colaboradores saem levando conhecimento com eles.",
    "Processos vivem na cabeça de poucas pessoas.",
    "Decisões são tomadas sem histórico nem contexto.",
    "Documentos espalhados entre pastas, chats e e-mails.",
    "Departamentos que não conversam entre si.",
    "Dezenas de softwares que não se integram.",
    "Retrabalho constante. Tempo perdido.",
    "Quanto mais a empresa cresce, mais caos.",
  ];

  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[color:var(--electric)]">
            O custo invisível
          </p>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold tracking-tight md:text-6xl">
            <span className="text-gradient">Empresas possuem memória?</span>
          </h2>
        </Reveal>
        <Reveal delay={2}>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            A maior parte das empresas funciona como um grupo de pessoas tentando
            lembrar de tudo ao mesmo tempo. Cada saída, cada mudança, cada crescimento —
            tudo vira ruído.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {pains.map((p, i) => (
            <Reveal key={p} delay={i * 0.4}>
              <motion.div
                whileHover={{ y: -4 }}
                className="glass grain group h-full rounded-2xl p-5"
              >
                <div className="mb-4 h-8 w-8 rounded-lg bg-white/5 p-1.5">
                  <div className="h-full w-full rounded bg-[repeating-linear-gradient(45deg,transparent,transparent_3px,rgba(255,255,255,0.15)_3px,rgba(255,255,255,0.15)_5px)]" />
                </div>
                <p className="text-sm leading-relaxed text-foreground/90">{p}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Birth of Corporate Brain (before / after)                                 */
/* -------------------------------------------------------------------------- */

function BrainSection() {
  return (
    <section id="produto" className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div>
            <Reveal>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-[color:var(--electric)]">
                Neural OS
              </p>
            </Reveal>
            <Reveal delay={1}>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-6xl">
                <span className="text-gradient">O nascimento</span>
                <br />
                <span className="text-electric-gradient">de um cérebro corporativo.</span>
              </h2>
            </Reveal>
            <Reveal delay={2}>
              <p className="mt-6 text-lg text-muted-foreground">
                Toda informação da empresa passa a se conectar. Todo processo passa a
                ter contexto. Todo aprendizado permanece — mesmo quando alguém sai.
              </p>
            </Reveal>
            <Reveal delay={3}>
              <ul className="mt-8 space-y-4 text-sm text-foreground/90">
                {[
                  "A empresa passa a lembrar de tudo.",
                  "Todas as informações se relacionam automaticamente.",
                  "Especialistas digitais trabalham juntos, o tempo inteiro.",
                  "Cada decisão nasce com histórico completo.",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-1 grid h-4 w-4 place-items-center rounded-full bg-[color:var(--electric)]/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--electric)]" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={2}>
            <BrainVisual />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function BrainVisual() {
  // Orbiting nodes around a central "brain"
  const nodes = Array.from({ length: 10 });
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]">
      <div className="absolute inset-0 rounded-full" style={{ background: "var(--gradient-hero)" }} />
      <div className="absolute inset-8 rounded-full glass" />
      {/* rings */}
      {[0.55, 0.72, 0.9].map((s, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 rounded-full hairline"
          style={{ width: `${s * 100}%`, height: `${s * 100}%`, translateX: "-50%", translateY: "-50%" }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 40 + i * 10, repeat: Infinity, ease: "linear" }}
        >
          {nodes.slice(0, 6 + i * 2).map((_, j, arr) => {
            const a = (j / arr.length) * Math.PI * 2;
            return (
              <span
                key={j}
                className="absolute h-1.5 w-1.5 rounded-full bg-[color:var(--cyan)] shadow-[0_0_8px_var(--cyan)]"
                style={{
                  left: `calc(50% + ${Math.cos(a) * 50}%)`,
                  top: `calc(50% + ${Math.sin(a) * 50}%)`,
                  transform: "translate(-50%,-50%)",
                }}
              />
            );
          })}
        </motion.div>
      ))}
      {/* central brain */}
      <motion.div
        className="absolute left-1/2 top-1/2 grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(120,180,255,0.9), rgba(80,120,255,0.3) 60%, transparent 70%)",
          boxShadow: "0 0 80px -10px rgba(90,150,255,0.7)",
        }}
      >
        <Brain className="h-10 w-10 text-white/90" />
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  How it works — pillars                                                    */
/* -------------------------------------------------------------------------- */

function HowItWorks() {
  const pillars = [
    {
      icon: Database,
      title: "Memória viva",
      desc: "Tudo que sua empresa produz — reuniões, contratos, decisões — passa a ficar registrado, indexado e disponível para sempre.",
    },
    {
      icon: Network,
      title: "Conexões automáticas",
      desc: "Cada informação se conecta a pessoas, projetos, clientes e processos. Nada mais vive isolado.",
    },
    {
      icon: Workflow,
      title: "Processos que executam sozinhos",
      desc: "Fluxos que antes dependiam de alguém agora acontecem de forma autônoma, com a empresa acompanhando cada passo.",
    },
    {
      icon: MessagesSquare,
      title: "Especialistas digitais",
      desc: "Assistentes que conhecem sua operação por dentro. Pergunte qualquer coisa, receba respostas com contexto real.",
    },
    {
      icon: Layers,
      title: "Uma camada única",
      desc: "Sobre planilhas, ERP, CRM, chats e pastas. Neural OS conecta tudo o que você já usa — sem trocar nada.",
    },
    {
      icon: Shield,
      title: "Conhecimento que não sai porta afora",
      desc: "Quando um colaborador sai, a inteligência dele permanece na empresa. O que foi aprendido nunca se perde.",
    },
  ];

  return (
    <section id="como" className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[color:var(--electric)]">
              Como funciona
            </p>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-6xl">
              <span className="text-gradient">Tudo conectado.</span>{" "}
              <span className="text-electric-gradient">Tudo vivo.</span>
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-6 text-lg text-muted-foreground">
              Uma nova infraestrutura por baixo de tudo que sua empresa já usa.
            </p>
          </Reveal>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.3}>
              <motion.div
                whileHover={{ y: -6 }}
                className="glass magnetic-ring group relative h-full overflow-hidden rounded-3xl p-8"
              >
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[color:var(--electric)]/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-40" />
                <div className="relative">
                  <div className="mb-6 grid h-11 w-11 place-items-center rounded-xl bg-white/5 text-[color:var(--cyan)]">
                    <p.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-xl font-semibold tracking-tight">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {p.desc}
                  </p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Before / After                                                            */
/* -------------------------------------------------------------------------- */

function BeforeAfter() {
  const rows = [
    { before: "Planilhas isoladas", after: "Uma verdade única para toda a empresa" },
    { before: "WhatsApp virou base de dados", after: "Conversas viram conhecimento estruturado" },
    { before: "Cada saída dói", after: "O aprendizado permanece" },
    { before: "Ninguém sabe onde está o arquivo", after: "Tudo aparece na hora certa" },
    { before: "Dezenas de softwares desconectados", after: "Uma camada única sobre todos eles" },
    { before: "Decisões no achismo", after: "Decisões com histórico completo" },
  ];
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <h2 className="font-display text-4xl font-semibold tracking-tight md:text-6xl">
              <span className="text-gradient">Antes.</span>{" "}
              <span className="text-electric-gradient">Depois.</span>
            </h2>
          </Reveal>
          <Reveal delay={1}>
            <p className="mt-6 text-lg text-muted-foreground">
              A mesma empresa, com uma nova forma de existir.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 overflow-hidden rounded-3xl hairline">
          <div className="grid grid-cols-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <div className="border-b border-r hairline p-5">Antes</div>
            <div className="border-b hairline bg-white/[0.02] p-5 text-[color:var(--cyan)]">
              Com Neural OS
            </div>
          </div>
          {rows.map((r, i) => (
            <Reveal key={r.before} delay={i * 0.3}>
              <div className="grid grid-cols-2 border-b hairline last:border-b-0">
                <div className="p-6 text-sm text-muted-foreground line-through decoration-white/20">
                  {r.before}
                </div>
                <div className="bg-white/[0.02] p-6 text-sm text-foreground">{r.after}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Use Cases                                                                 */
/* -------------------------------------------------------------------------- */

function UseCases() {
  const cases = [
    {
      icon: Users,
      title: "Onboarding em minutos",
      desc: "Um novo colaborador chega e, no primeiro dia, entende a empresa como um veterano.",
    },
    {
      icon: FileStack,
      title: "Contratos e documentos",
      desc: "Todo documento vira consultável. Cláusulas, prazos e histórico ao alcance de uma pergunta.",
    },
    {
      icon: Clock,
      title: "Reuniões que se organizam sozinhas",
      desc: "Cada conversa vira decisão, tarefa e memória viva — automaticamente.",
    },
    {
      icon: Building2,
      title: "Grupos e holdings",
      desc: "Diferentes empresas, uma única inteligência. Comparações, indicadores e contexto em tempo real.",
    },
  ];
  return (
    <section id="casos" className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <Reveal>
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-[color:var(--electric)]">
                Casos de uso
              </p>
              <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold tracking-tight md:text-5xl text-gradient">
                Onde o Neural OS aparece no dia a dia.
              </h2>
            </div>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2">
          {cases.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.3}>
              <motion.div
                whileHover={{ y: -4 }}
                className="glass group flex h-full items-start gap-5 rounded-3xl p-8"
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-white/10 to-white/[0.02] text-[color:var(--cyan)]">
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold tracking-tight">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {c.desc}
                  </p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Timeline                                                                  */
/* -------------------------------------------------------------------------- */

function Timeline() {
  const steps = [
    { t: "Semana 1", h: "Escuta profunda", d: "Mergulhamos na sua operação, processos e cultura." },
    { t: "Semana 2–3", h: "Implantação", d: "Neural OS se conecta ao que sua empresa já usa." },
    { t: "Semana 4", h: "Ativação", d: "A memória, os fluxos e os especialistas digitais entram no ar." },
    { t: "Contínuo", h: "Evolução", d: "A empresa aprende sozinha. Todo dia fica mais inteligente." },
  ];
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <h2 className="font-display text-4xl font-semibold tracking-tight md:text-6xl text-gradient">
              De empresa comum a organização com cérebro.
            </h2>
          </Reveal>
        </div>
        <div className="relative mx-auto mt-20 max-w-4xl">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[color:var(--electric)]/50 to-transparent md:left-1/2" />
          <div className="space-y-16">
            {steps.map((s, i) => (
              <Reveal key={s.h} delay={i * 0.4}>
                <div
                  className={`relative grid grid-cols-[32px_1fr] gap-6 md:grid-cols-2 md:gap-16 ${
                    i % 2 === 0 ? "" : "md:[&>div:first-child]:col-start-2"
                  }`}
                >
                  <div className="absolute left-4 top-2 h-3 w-3 -translate-x-1/2 rounded-full bg-[color:var(--electric)] shadow-[0_0_20px_var(--electric)] md:left-1/2" />
                  <div className={i % 2 === 0 ? "md:pr-16 md:text-right" : "md:col-start-2 md:pl-16"}>
                    <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--cyan)]">
                      {s.t}
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight">
                      {s.h}
                    </h3>
                    <p className="mt-3 text-sm text-muted-foreground">{s.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Who uses                                                                  */
/* -------------------------------------------------------------------------- */

function WhoUses() {
  const items = [
    "Grupos empresariais",
    "Holdings familiares",
    "Empresas 5M — 500M+",
    "Operações multi-unidade",
    "CEOs e diretorias",
    "Empresas em consolidação",
  ];
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[color:var(--electric)]">
            Quem utiliza
          </p>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold tracking-tight md:text-5xl text-gradient">
            Pensado para quem decide o rumo da empresa.
          </h2>
        </Reveal>
        <div className="mt-12 flex flex-wrap gap-3">
          {items.map((t, i) => (
            <Reveal key={t} delay={i * 0.2}>
              <span className="glass rounded-full px-5 py-2.5 text-sm text-foreground/90">
                {t}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  FAQ                                                                       */
/* -------------------------------------------------------------------------- */

function FAQ() {
  const faqs = [
    {
      q: "Isso substitui meu ERP, CRM ou os softwares que já uso?",
      a: "Não. Neural OS vive sobre eles. Sua empresa mantém tudo o que já funciona e ganha uma camada de inteligência que conecta e organiza tudo em um só lugar.",
    },
    {
      q: "Quanto tempo até estar rodando?",
      a: "A ativação inicial acontece em poucas semanas. A inteligência da empresa continua evoluindo continuamente a partir do primeiro dia.",
    },
    {
      q: "E a segurança das nossas informações?",
      a: "Neural OS opera em um ambiente dedicado à sua empresa, com controles rígidos de acesso, auditoria e conformidade. Sua informação é sua — e só sua.",
    },
    {
      q: "Precisamos ter time técnico interno?",
      a: "Não. Nosso time cuida da implantação e evolução. Sua diretoria só vê o resultado.",
    },
    {
      q: "É para qualquer empresa?",
      a: "Neural OS foi desenhado para empresas acima de 5 milhões de faturamento, com operação complexa o suficiente para justificar uma organização com cérebro próprio.",
    },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative py-32">
      <div className="mx-auto max-w-4xl px-6">
        <Reveal>
          <h2 className="text-center font-display text-4xl font-semibold tracking-tight md:text-5xl text-gradient">
            Perguntas frequentes
          </h2>
        </Reveal>
        <div className="mt-16 space-y-3">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.3}>
              <div className="glass overflow-hidden rounded-2xl">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
                >
                  <span className="font-display text-lg font-medium">{f.q}</span>
                  <motion.span
                    animate={{ rotate: open === i ? 45 : 0 }}
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full hairline text-muted-foreground"
                  >
                    +
                  </motion.span>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: open === i ? "auto" : 0,
                    opacity: open === i ? 1 : 0,
                  }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </p>
                </motion.div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Final CTA                                                                 */
/* -------------------------------------------------------------------------- */

function FinalCTA() {
  return (
    <section className="relative py-40">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <Sparkles className="mx-auto h-6 w-6 text-[color:var(--cyan)]" />
        </Reveal>
        <Reveal delay={1}>
          <h2 className="mt-6 font-display text-5xl font-semibold tracking-tight md:text-7xl">
            <span className="text-gradient">Sua empresa não precisa</span>
            <br />
            <span className="text-electric-gradient">de mais um software.</span>
          </h2>
        </Reveal>
        <Reveal delay={2}>
          <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground">
            Precisa de uma nova forma de existir. Vamos mostrar como Neural OS
            transforma a maneira como sua empresa pensa, decide e cresce.
          </p>
        </Reveal>
        <Reveal delay={3}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <MagneticButton variant="primary">
              Solicitar demonstração <ArrowRight className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton variant="ghost">Falar com um sócio</MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Footer                                                                    */
/* -------------------------------------------------------------------------- */

function Footer() {
  return (
    <footer className="border-t hairline py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-white to-white/40 text-background">
                <Brain className="h-4 w-4" />
              </span>
              <span className="font-display text-sm font-semibold tracking-tight">
                Neural OS
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              O sistema operacional que dá cérebro à sua empresa.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Produto
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#produto" className="hover:text-foreground text-muted-foreground">Visão geral</a></li>
              <li><a href="#como" className="hover:text-foreground text-muted-foreground">Como funciona</a></li>
              <li><a href="#casos" className="hover:text-foreground text-muted-foreground">Casos de uso</a></li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Contato
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#" className="hover:text-foreground text-muted-foreground">Solicitar demo</a></li>
              <li><a href="#" className="hover:text-foreground text-muted-foreground">Falar com um sócio</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t hairline pt-8 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Neural OS. Uma nova categoria de software corporativo.</p>
          <p>Feito para quem decide.</p>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

function NeuralOSLanding() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <Hero />
        <Analogy />
        <Problem />
        <BrainSection />
        <HowItWorks />
        <BeforeAfter />
        <UseCases />
        <Timeline />
        <WhoUses />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
