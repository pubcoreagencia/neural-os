"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  CircleDot,
  Clock3,
  Database,
  FileText,
  Fingerprint,
  GitBranch,
  LockKeyhole,
  MessageSquare,
  Network,
  Radar,
  ShieldCheck,
  Sparkles,
  UsersRound
} from "lucide-react";
import { useRef } from "react";
import { MagneticButton } from "@/components/magnetic-button";
import { MotionRuntime } from "@/components/motion-runtime";
import { NeuralCanvas } from "@/components/neural-canvas";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Problema", href: "#problema" },
  { label: "Sistema", href: "#sistema" },
  { label: "Ecossistema", href: "#ecossistema" },
  { label: "Usos", href: "#usos" },
  { label: "Impacto", href: "#impacto" }
];

const executiveCosts = [
  "Decisões sem histórico",
  "Processos presos em pessoas",
  "Informação espalhada",
  "Times que não se conversam",
  "Retrabalho invisível",
  "Crescimento que aumenta o caos"
];

const operatingSystemAnalogies = [
  {
    name: "Computadores",
    system: "Windows",
    result: "organiza arquivos, programas e permissões"
  },
  {
    name: "iPhones",
    system: "iOS",
    result: "organiza aplicativos, dados e experiência"
  },
  {
    name: "Empresas",
    system: "Neural OS",
    result: "organiza conhecimento, decisões e processos"
  }
];

const transformationSteps = [
  {
    label: "01",
    title: "A empresa passa a lembrar",
    text: "Reuniões, decisões, documentos, clientes e processos deixam de evaporar no dia a dia."
  },
  {
    label: "02",
    title: "Tudo começa a se relacionar",
    text: "Áreas, dados e responsabilidades ganham contexto comum. A informação correta aparece no momento certo."
  },
  {
    label: "03",
    title: "Especialistas digitais entram em operação",
    text: "Eles ajudam pessoas, acompanham rotinas, preservam padrões e executam etapas com rastreabilidade."
  },
  {
    label: "04",
    title: "A gestão ganha um centro nervoso",
    text: "O empresário enxerga o que acontece, por que acontece e qual decisão merece prioridade."
  }
];

const connectedItems = [
  "WhatsApp",
  "Documentos",
  "CRM",
  "ERP",
  "E-mail",
  "Calendário",
  "Dashboards",
  "Playbooks",
  "Contratos",
  "Projetos",
  "Financeiro",
  "Vendas"
];

const useCases = [
  {
    icon: Building2,
    title: "Holding",
    text: "Padronize conhecimento entre empresas, preserve decisões e enxergue a operação sem depender de relatos dispersos."
  },
  {
    icon: UsersRound,
    title: "Diretoria",
    text: "Converta reuniões, planos e indicadores em uma memória executiva viva, consultável e confiável."
  },
  {
    icon: FileText,
    title: "Operações",
    text: "Transforme rotinas em processos claros, acompanhados e reutilizáveis por qualquer pessoa autorizada."
  },
  {
    icon: MessageSquare,
    title: "Comercial",
    text: "Organize histórico, objeções, propostas, follow-ups e aprendizado de vendas em uma mesma inteligência."
  },
  {
    icon: ShieldCheck,
    title: "Governança",
    text: "Cada informação ganha origem, proprietário, versão e nível de confiança para decisões sensíveis."
  },
  {
    icon: Radar,
    title: "Estratégia",
    text: "Simule cenários, compare prioridades e entenda o impacto antes de mover capital, pessoas e tempo."
  }
];

const benefits = [
  { value: "1", label: "fonte oficial para conhecimento crítico" },
  { value: "24h", label: "de operação assistida por especialistas digitais" },
  { value: "100%", label: "das decisões importantes com histórico" },
  { value: "0", label: "dependência de memória informal como método de gestão" }
];

const timeline = [
  "Diagnóstico da inteligência atual",
  "Organização da memória institucional",
  "Conexão das fontes de informação",
  "Modelagem dos processos críticos",
  "Ativação dos especialistas digitais",
  "Governança, melhoria contínua e expansão"
];

const intelligenceLayers = [
  ["Experiência", "Portal, dashboard, chat, API e canais de operação."],
  ["Orquestração", "Entende intenção, escolhe recursos e coordena o trabalho."],
  ["Agentes e workflows", "Especialistas digitais executam processos com limites e métricas."],
  ["Conhecimento e memória", "A fonte oficial, versionada, pesquisável e com origem."],
  ["Dados e conexões", "Sistemas, documentos e eventos sincronizados com auditoria."]
];

const holdingFlow = [
  "Pub Media cria atenção",
  "PubLeads transforma atenção em oportunidades",
  "Pub Start qualifica a entrada",
  "Pub Agência converte soluções",
  "PubMachine organiza a relação com clientes",
  "Pub IA automatiza e amplia a operação",
  "Pub Core OS acompanha o ecossistema",
  "Receita se transforma em ativos e nova escala"
];

const faq = [
  {
    q: "O Neural OS substitui meus sistemas atuais?",
    a: "Não precisa começar substituindo. Ele cria uma camada de inteligência sobre o que a empresa já usa e transforma informação dispersa em gestão coordenada."
  },
  {
    q: "Isso é apenas mais uma ferramenta de IA?",
    a: "Não. IA é parte da infraestrutura. A categoria é outra: um sistema operacional para a empresa administrar conhecimento, decisões e processos."
  },
  {
    q: "Para quem faz sentido?",
    a: "Empresas em crescimento, holdings, grupos com várias áreas e negócios em que conhecimento, velocidade e governança impactam diretamente o resultado."
  },
  {
    q: "Quanto tempo leva para perceber valor?",
    a: "A percepção aparece cedo quando os primeiros processos críticos deixam de depender de busca manual, conversas soltas e memória individual."
  }
];

const reveal = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0 }
};

export function LandingPage() {
  return (
    <>
      <MotionRuntime />
      <ProgressBar />
      <Header />
      <main>
        <Hero />
        <MemoryQuestion />
        <InvisibleCost />
        <CorporateBrain />
        <HowItWorks />
        <ConnectedSystem />
        <NeuralArchitecture />
        <HoldingEcosystem />
        <UseCases />
        <ImplementationTimeline />
        <VisualDemo />
        <Benefits />
        <WhoUses />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}

function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.2 });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 top-0 z-[80] h-px w-full origin-left bg-gradient-to-r from-neural-cyan via-white to-neural-violet"
      style={{ scaleX }}
    />
  );
}

function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-ink-950/68 backdrop-blur-2xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8" aria-label="Navegação principal">
        <a href="#top" className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-neural-cyan/70">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-[8px] border border-white/10 bg-white/[0.06] shadow-inner-glow">
            <span className="h-2.5 w-2.5 rounded-full bg-neural-cyan shadow-[0_0_22px_rgba(86,228,255,.9)]" />
          </span>
          <span className="font-display text-sm font-semibold tracking-[0.14em] text-white">NEURAL OS</span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="text-sm text-white/62 transition hover:text-white">
              {item.label}
            </a>
          ))}
        </div>

        <a
          href="#demonstracao"
          className="inline-flex h-10 items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 text-sm font-medium text-white transition hover:border-neural-cyan/40 hover:text-neural-cyan"
        >
          Demonstração
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </a>
      </nav>
    </header>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-neural-cyan">
      <CircleDot aria-hidden="true" className="h-3.5 w-3.5" />
      {children}
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="relative flex min-h-[84svh] items-center overflow-hidden px-5 pb-10 pt-24 lg:px-8">
      <NeuralCanvas />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink-950 to-transparent" />
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[minmax(0,1fr)_440px]">
        <motion.div
          variants={reveal}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.9, ease: [0.21, 0.8, 0.24, 1] }}
          className="relative z-10"
        >
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5 text-sm text-white/74 shadow-inner-glow">
            <Sparkles aria-hidden="true" className="h-4 w-4 text-neural-cyan" />
            O sistema operacional da empresa
          </p>
          <h1 className="max-w-5xl text-balance font-display text-[clamp(3rem,5.7vw,6.7rem)] font-semibold leading-[0.92] text-white">
            Sua empresa já tem pessoas. Está na hora de ter um cérebro.
          </h1>
          <p className="mt-7 max-w-2xl text-pretty text-lg leading-8 text-white/68 md:text-xl">
            O Neural OS organiza conhecimento, decisões e processos em uma inteligência corporativa que pertence à empresa, não à memória de cada pessoa.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <MagneticButton href="#demonstracao">Solicitar demonstração</MagneticButton>
            <MagneticButton href="#sistema" variant="secondary" icon={<ChevronDown aria-hidden="true" className="h-4 w-4" />}>
              Ver como funciona
            </MagneticButton>
          </div>

          <div className="mt-9 grid max-w-3xl gap-3 text-sm text-white/58 sm:grid-cols-3">
            {["Memória institucional", "Processos vivos", "Decisões rastreáveis"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Check aria-hidden="true" className="h-4 w-4 text-neural-cyan" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.24, duration: 0.9, ease: [0.21, 0.8, 0.24, 1] }}
          className="relative z-10 hidden lg:block"
          aria-label="Resumo executivo do Neural OS"
        >
          <div className="glass scan-line relative overflow-hidden rounded-[8px] p-5">
            <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/42">Estado da empresa</p>
                <p className="mt-1 font-display text-xl text-white">Inteligência centralizada</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-neural-cyan/10 text-neural-cyan">
                <Fingerprint aria-hidden="true" className="h-5 w-5" />
              </div>
            </div>
            <div className="space-y-4">
              {[
                ["Conhecimento crítico", "preservado"],
                ["Processos principais", "orquestrados"],
                ["Decisões executivas", "rastreáveis"],
                ["Times e sistemas", "conectados"]
              ].map(([label, status]) => (
                <div key={label} className="flex items-center justify-between gap-4 rounded-[8px] border border-white/8 bg-black/16 px-4 py-3">
                  <span className="text-sm text-white/66">{label}</span>
                  <span className="text-sm font-medium text-neural-cyan">{status}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}

function MemoryQuestion() {
  return (
    <section id="problema" className="relative overflow-hidden px-5 pb-28 pt-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div data-gsap="rise">
            <SectionLabel>Empresas possuem memória?</SectionLabel>
            <h2 className="text-balance font-display text-5xl font-semibold leading-tight text-white md:text-7xl">
              A maioria das empresas não é administrada. Ela é lembrada.
            </h2>
          </div>
          <p data-gsap="rise" className="max-w-2xl text-pretty text-xl leading-9 text-white/65">
            Colaboradores saem levando contexto. Decisões importantes ficam em conversas. Processos existem porque alguém sabe fazer. O crescimento não cria clareza; ele multiplica dependências invisíveis.
          </p>
        </div>

        <div className="mt-16 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {executiveCosts.map((cost, index) => (
            <motion.div
              key={cost}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: index * 0.04, duration: 0.55 }}
              className="group relative min-h-28 overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.035] p-5"
            >
              <div className="absolute inset-x-0 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-neural-cyan to-transparent transition duration-500 group-hover:scale-x-100" />
              <p className="text-lg font-medium text-white">{cost}</p>
              <p className="mt-3 text-sm leading-6 text-white/48">O tipo de custo que raramente aparece no DRE, mas limita a empresa todos os dias.</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InvisibleCost() {
  return (
    <section className="relative overflow-hidden border-y border-white/[0.06] bg-white/[0.025] px-5 py-28 lg:px-8">
      <div className="quiet-grid absolute inset-0 opacity-35" />
      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div data-gsap="rise">
          <SectionLabel>O custo invisível da desorganização</SectionLabel>
          <h2 className="text-balance font-display text-5xl font-semibold leading-tight md:text-7xl">
            O caos não chega fazendo barulho. Ele chega como rotina.
          </h2>
          <p className="mt-7 max-w-xl text-lg leading-8 text-white/62">
            Um arquivo duplicado. Uma decisão sem registro. Um processo explicado pela quinta vez. Uma pergunta simples que leva horas para responder.
          </p>
        </div>

        <div data-gsap="rise" className="relative">
          <div className="absolute left-6 top-6 h-full w-full rounded-[8px] border border-neural-cyan/18" />
          <div className="relative overflow-hidden rounded-[8px] border border-white/10 bg-ink-900/86 p-6 shadow-glow">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm uppercase tracking-[0.18em] text-white/42">Antes</p>
              <Clock3 aria-hidden="true" className="h-5 w-5 text-white/36" />
            </div>
            <div className="space-y-3">
              {[
                "Onde está a versão correta?",
                "Quem decidiu isso?",
                "Qual é o processo atual?",
                "O cliente já recebeu retorno?",
                "Por que esse projeto atrasou?"
              ].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0.2, x: index % 2 === 0 ? -14 : 14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.45 }}
                  className={cn(
                    "rounded-[8px] border border-white/8 bg-white/[0.035] px-4 py-3 text-white/68",
                    index === 1 || index === 4 ? "ml-8" : ""
                  )}
                >
                  {item}
                </motion.div>
              ))}
            </div>
            <div data-gsap="trace" className="mt-8 h-px bg-gradient-to-r from-neural-cyan via-white/40 to-transparent" />
            <p className="mt-5 text-2xl font-semibold text-white">Quando ninguém sabe onde está a verdade, a empresa desacelera.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CorporateBrain() {
  return (
    <section id="sistema" className="relative overflow-hidden px-5 py-32 lg:px-8">
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(86,228,255,.06),transparent_35%,rgba(140,109,255,.045)_72%,transparent)]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center" data-gsap="rise">
          <SectionLabel>O nascimento de um cérebro corporativo</SectionLabel>
          <h2 className="text-balance font-display text-5xl font-semibold leading-tight md:text-7xl">
            Windows organiza computadores. iOS organiza iPhones. Neural OS organiza empresas.
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-white/62">
            Não é uma ferramenta a mais. É uma camada central para transformar informação, rotina e decisão em patrimônio da organização.
          </p>
        </div>

        <div className="mt-16 grid gap-3 lg:grid-cols-3">
          {operatingSystemAnalogies.map((item, index) => (
            <div
              key={item.name}
              data-gsap="rise"
              className={cn(
                "relative overflow-hidden rounded-[8px] border p-6",
                index === 2
                  ? "border-neural-cyan/36 bg-neural-cyan/[0.075] shadow-glow"
                  : "border-white/10 bg-white/[0.035]"
              )}
            >
              <p className="text-sm uppercase tracking-[0.18em] text-white/42">{item.name}</p>
              <p className="mt-5 font-display text-4xl font-semibold text-white">{item.system}</p>
              <p className="mt-4 text-base leading-7 text-white/58">{item.result}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="px-5 py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div data-gsap="rise" className="lg:sticky lg:top-28 lg:h-fit">
            <SectionLabel>Como funciona</SectionLabel>
            <h2 className="text-balance font-display text-5xl font-semibold leading-tight md:text-7xl">
              Primeiro a empresa lembra. Depois ela aprende a operar melhor.
            </h2>
            <p className="mt-7 max-w-xl text-lg leading-8 text-white/62">
              O Neural OS não exige que o executivo entenda tecnologia. Ele precisa apenas perceber uma mudança: a empresa ganha memória, coordenação e continuidade.
            </p>
          </div>

          <div className="space-y-4">
            {transformationSteps.map((step) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.62 }}
                className="relative overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.035] p-6"
              >
                <div className="absolute bottom-0 left-0 top-0 w-px bg-gradient-to-b from-transparent via-neural-cyan to-transparent" />
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                  <span className="font-display text-sm font-semibold text-neural-cyan">{step.label}</span>
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-white">{step.title}</h3>
                    <p className="mt-3 max-w-2xl text-base leading-7 text-white/58">{step.text}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ConnectedSystem() {
  return (
    <section className="relative overflow-hidden border-y border-white/[0.06] bg-ink-900 px-5 py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div data-gsap="rise">
            <SectionLabel>Tudo conectado</SectionLabel>
            <h2 className="text-balance font-display text-5xl font-semibold leading-tight md:text-7xl">
              Antes, cada área tinha uma versão da empresa. Agora, a empresa tem uma versão de si mesma.
            </h2>
          </div>
          <div data-gsap="rise" className="rounded-[8px] border border-white/10 bg-black/20 p-5">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {connectedItems.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, scale: 0.94 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.025, duration: 0.4 }}
                  className="flex h-16 items-center justify-center rounded-[8px] border border-white/8 bg-white/[0.035] text-sm text-white/68"
                >
                  {item}
                </motion.div>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-3 rounded-[8px] border border-neural-cyan/20 bg-neural-cyan/[0.065] px-4 py-3 text-sm text-white/72">
              <GitBranch aria-hidden="true" className="h-4 w-4 text-neural-cyan" />
              Tudo conversa. Tudo ganha contexto. Tudo passa a servir a uma gestão mais precisa.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NeuralArchitecture() {
  return (
    <section id="ecossistema" className="relative overflow-hidden border-y border-white/[0.06] bg-ink-900 px-5 py-28 lg:px-8">
      <div className="quiet-grid absolute inset-0 opacity-25" />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div data-gsap="rise">
            <SectionLabel>Arquitetura de inteligência</SectionLabel>
            <h2 className="text-balance font-display text-5xl font-semibold leading-tight text-white md:text-7xl">
              Uma única verdade. Várias formas de transformar contexto em ação.
            </h2>
          </div>
          <p data-gsap="rise" className="max-w-2xl text-lg leading-8 text-white/62">
            O Neural OS centraliza o conhecimento oficial da PUB Holding e conecta pessoas, agentes e sistemas. Toda resposta relevante pode carregar contexto, origem e histórico — sem criar uma nova ilha de informação.
          </p>
        </div>

        <div className="mt-16 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          {intelligenceLayers.map(([title, text], index) => (
            <article key={title} data-gsap="rise" className="relative min-h-64 overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.035] p-5">
              <span className="text-xs font-semibold tracking-[0.18em] text-neural-cyan">0{index + 1}</span>
              <h3 className="mt-8 font-display text-2xl font-semibold text-white">{title}</h3>
              <p className="mt-4 text-sm leading-6 text-white/55">{text}</p>
              {index < intelligenceLayers.length - 1 ? <div aria-hidden="true" className="absolute bottom-5 right-5 text-neural-cyan/55">↓</div> : null}
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-2">
          <div data-gsap="rise" className="rounded-[8px] border border-neural-cyan/20 bg-neural-cyan/[0.05] p-6">
            <Database aria-hidden="true" className="h-6 w-6 text-neural-cyan" />
            <h3 className="mt-5 font-display text-2xl font-semibold text-white">Memória institucional</h3>
            <p className="mt-3 max-w-xl leading-7 text-white/60">Documentos, decisões, playbooks, projetos e aprendizados viram patrimônio organizado, com versão, proprietário, status, fonte e nível de confiança.</p>
          </div>
          <div data-gsap="rise" className="rounded-[8px] border border-white/10 bg-white/[0.035] p-6">
            <Network aria-hidden="true" className="h-6 w-6 text-neural-violet" />
            <h3 className="mt-5 font-display text-2xl font-semibold text-white">Relações que explicam o negócio</h3>
            <p className="mt-3 max-w-xl leading-7 text-white/60">Empresas, produtos, clientes, pessoas, agentes e workflows deixam de ser listas desconectadas e passam a revelar dependências e impacto.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function HoldingEcosystem() {
  return (
    <section className="relative overflow-hidden px-5 py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div data-gsap="rise">
            <SectionLabel>Ecossistema PUB Holding</SectionLabel>
            <h2 className="text-balance font-display text-5xl font-semibold leading-tight text-white md:text-7xl">
              Atenção, sistemas, receita, ativos. Um ciclo que aprende a escalar.
            </h2>
            <p className="mt-7 max-w-xl text-lg leading-8 text-white/62">
              A inteligência não pertence a uma única unidade. Ela conecta aquisição, comercial, operação, tecnologia, mídia e expansão para que cada movimento fortaleça o ecossistema inteiro.
            </p>
          </div>
          <ol data-gsap="rise" className="space-y-2 rounded-[8px] border border-white/10 bg-white/[0.025] p-4">
            {holdingFlow.map((item, index) => (
              <li key={item} className="flex items-center gap-4 rounded-[8px] border border-white/[0.07] bg-black/10 px-4 py-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neural-cyan/25 text-xs font-semibold text-neural-cyan">{index + 1}</span>
                <span className="text-sm leading-6 text-white/70">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function UseCases() {
  return (
    <section id="usos" className="px-5 py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div data-gsap="rise" className="max-w-3xl">
          <SectionLabel>Casos de uso</SectionLabel>
          <h2 className="text-balance font-display text-5xl font-semibold leading-tight md:text-7xl">
            Uma nova camada para decisões que custam caro.
          </h2>
        </div>

        <div className="mt-14 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {useCases.map((item) => (
            <article key={item.title} data-gsap="rise" className="group rounded-[8px] border border-white/10 bg-white/[0.035] p-6 transition duration-300 hover:border-neural-cyan/30 hover:bg-white/[0.055]">
              <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-[8px] border border-white/10 bg-white/[0.055] text-neural-cyan transition group-hover:border-neural-cyan/40">
                <item.icon aria-hidden="true" className="h-5 w-5" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-base leading-7 text-white/56">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ImplementationTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const x = useTransform(scrollYProgress, [0, 1], ["4%", "-20%"]);

  return (
    <section ref={ref} className="relative overflow-hidden border-y border-white/[0.06] bg-white/[0.025] px-5 py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div data-gsap="rise" className="max-w-3xl">
          <SectionLabel>Linha do tempo</SectionLabel>
          <h2 className="text-balance font-display text-5xl font-semibold leading-tight md:text-7xl">
            Implantação com ordem, profundidade e expansão controlada.
          </h2>
        </div>
      </div>
      <div className="mt-14 overflow-hidden">
        <motion.div style={{ x }} className="flex min-w-max gap-3 px-5 lg:px-[calc((100vw-80rem)/2+2rem)]">
          {timeline.map((item, index) => (
            <div key={item} className="w-[280px] shrink-0 rounded-[8px] border border-white/10 bg-ink-950/82 p-6">
              <span className="text-sm font-semibold text-neural-cyan">{String(index + 1).padStart(2, "0")}</span>
              <p className="mt-8 font-display text-2xl font-semibold text-white">{item}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function VisualDemo() {
  return (
    <section id="demonstracao" className="relative overflow-hidden px-5 py-32 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div data-gsap="rise">
          <SectionLabel>Demonstração visual</SectionLabel>
          <h2 className="text-balance font-display text-5xl font-semibold leading-tight md:text-7xl">
            Perguntas deixam de circular. Elas encontram a verdade.
          </h2>
          <p className="mt-7 max-w-xl text-lg leading-8 text-white/62">
            A experiência central é simples: qualquer pessoa autorizada pergunta. O Neural OS entende o contexto da empresa, consulta a memória oficial e mostra o caminho com segurança.
          </p>
        </div>

        <div data-gsap="rise" className="overflow-hidden rounded-[8px] border border-white/10 bg-[#05070b] shadow-glow">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-white/22" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/22" />
            <span className="h-2.5 w-2.5 rounded-full bg-neural-cyan/80" />
            <span className="ml-3 text-xs uppercase tracking-[0.18em] text-white/34">Neural OS Console</span>
          </div>
          <div className="grid gap-0 lg:grid-cols-[1fr_0.8fr]">
            <div className="border-b border-white/10 p-5 lg:border-b-0 lg:border-r">
              <div className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4">
                <p className="text-sm text-white/42">Pergunta executiva</p>
                <p className="mt-3 text-xl font-medium leading-8 text-white">
                  O que precisa mudar para abrir uma nova unidade sem aumentar o caos operacional?
                </p>
              </div>
              <div className="mt-5 space-y-3">
                {[
                  ["Memória", "recuperando decisões anteriores"],
                  ["Processos", "comparando rotinas críticas"],
                  ["Riscos", "mapeando dependências"],
                  ["Plano", "priorizando ações executivas"]
                ].map(([label, value], index) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.12, duration: 0.45 }}
                    className="flex items-center justify-between gap-4 rounded-[8px] border border-white/8 bg-white/[0.025] px-4 py-3"
                  >
                    <span className="text-sm font-medium text-white">{label}</span>
                    <span className="text-right text-sm text-white/48">{value}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="p-5">
              <p className="text-sm uppercase tracking-[0.18em] text-neural-cyan">Resposta</p>
              <p className="mt-4 text-pretty text-lg leading-8 text-white/72">
                A expansão só deve avançar depois que atendimento, financeiro e implantação operarem com donos claros, versões únicas de processo e indicadores semanais de capacidade.
              </p>
              <div className="mt-6 rounded-[8px] border border-neural-cyan/18 bg-neural-cyan/[0.06] p-4">
                <p className="text-sm font-medium text-white">Próximo movimento recomendado</p>
                <p className="mt-2 text-sm leading-6 text-white/58">
                  Criar um plano de 30 dias para estabilizar as rotinas antes de contratar, abrir praça ou aumentar demanda comercial.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  return (
    <section id="impacto" className="border-y border-white/[0.06] bg-white/[0.025] px-5 py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div data-gsap="rise" className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <SectionLabel>Benefícios</SectionLabel>
            <h2 className="text-balance font-display text-5xl font-semibold leading-tight md:text-7xl">
              A empresa fica menos dependente de pessoas específicas e mais capaz de evoluir.
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-white/62">
            Pessoas continuam essenciais. A diferença é que o conhecimento deixa de ficar preso nelas. O negócio ganha continuidade, padrão e velocidade.
          </p>
        </div>

        <div className="mt-16 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item) => (
            <div key={item.label} data-gsap="rise" className="rounded-[8px] border border-white/10 bg-ink-950/70 p-6">
              <p className="font-display text-5xl font-semibold text-white">{item.value}</p>
              <p className="mt-4 text-base leading-7 text-white/56">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhoUses() {
  return (
    <section className="px-5 py-28 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div data-gsap="rise">
          <SectionLabel>Quem utiliza</SectionLabel>
          <h2 className="text-balance font-display text-5xl font-semibold leading-tight md:text-7xl">
            Feito para quem decide com capital, reputação e crescimento em jogo.
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {["CEOs", "Sócios", "Holdings", "Diretores", "Grupos empresariais", "Operações em escala"].map((item) => (
            <div key={item} data-gsap="rise" className="flex min-h-24 items-center gap-4 rounded-[8px] border border-white/10 bg-white/[0.035] p-5">
              <LockKeyhole aria-hidden="true" className="h-5 w-5 shrink-0 text-neural-cyan" />
              <span className="font-display text-xl font-semibold text-white">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section className="border-y border-white/[0.06] bg-ink-900 px-5 py-28 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.75fr_1.25fr]">
        <div data-gsap="rise">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="text-balance font-display text-5xl font-semibold leading-tight md:text-7xl">
            Perguntas que importam antes de uma decisão séria.
          </h2>
        </div>
        <div className="space-y-3">
          {faq.map((item) => (
            <details key={item.q} data-gsap="rise" className="group rounded-[8px] border border-white/10 bg-white/[0.035] p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-display text-xl font-semibold text-white">
                {item.q}
                <ChevronDown aria-hidden="true" className="h-5 w-5 shrink-0 text-white/44 transition group-open:rotate-180 group-open:text-neural-cyan" />
              </summary>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/58">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative overflow-hidden px-5 py-32 lg:px-8">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(86,228,255,.08),transparent_36%,rgba(140,109,255,.06)_72%,transparent)]" />
      <div className="relative mx-auto max-w-5xl text-center" data-gsap="rise">
        <SectionLabel>Uma nova forma de administrar</SectionLabel>
        <h2 className="text-balance font-display text-5xl font-semibold leading-tight md:text-7xl">
          Conheça a camada que transforma conhecimento em patrimônio da empresa.
        </h2>
        <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-white/62">
          Não é sobre comprar mais uma ferramenta. É sobre preparar a empresa para crescer com memória, clareza e inteligência própria.
        </p>
        <div className="mt-10 flex justify-center">
          <MagneticButton href="mailto:contato@pubholding.com?subject=Demonstra%C3%A7%C3%A3o%20Neural%20OS">
            Solicitar demonstração executiva
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/[0.06] px-5 py-10 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sm text-white/44 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-white/10 bg-white/[0.06]">
            <span className="h-2.5 w-2.5 rounded-full bg-neural-cyan" />
          </span>
          <span className="font-display font-semibold tracking-[0.14em] text-white">NEURAL OS</span>
        </div>
        <div className="flex flex-wrap gap-5">
          <a href="#problema" className="transition hover:text-white">Problema</a>
          <a href="#sistema" className="transition hover:text-white">Sistema</a>
          <a href="#usos" className="transition hover:text-white">Usos</a>
          <a href="#demonstracao" className="transition hover:text-white">Demonstração</a>
        </div>
        <p>© 2026 PUB Holding. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
