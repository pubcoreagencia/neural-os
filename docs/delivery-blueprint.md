# Neural OS - Blueprint de Entrega

## Norte do Produto

O Neural OS deve ser percebido como uma nova categoria: o sistema operacional da empresa. Ele não vende IA, automação ou software. Ele vende uma forma superior de administrar conhecimento, decisões e processos.

Frase-guia: "A empresa deixa de depender da memória das pessoas e passa a ter uma inteligência própria."

## Público

- CEOs, sócios e fundadores.
- Holdings e grupos empresariais.
- Diretores de empresas em crescimento.
- Operações que sofrem com conhecimento disperso, retrabalho e decisões sem histórico.

## Arquitetura da Informação

1. Hero: apresenta a categoria e a analogia do sistema operacional.
2. Empresas possuem memória?: revela o problema emocional e operacional.
3. Custo invisível: mostra como o caos aparece na rotina.
4. Cérebro corporativo: reposiciona o Neural OS como nova camada de gestão.
5. Como funciona: traduz o produto em quatro transformações humanas.
6. Tudo conectado: mostra a unificação das fontes da empresa.
7. Casos de uso: aproxima o valor de funções executivas reais.
8. Linha do tempo: demonstra implantação ordenada.
9. Demonstração visual: simula uma pergunta executiva de alto valor.
10. Benefícios: fixa percepção de ticket alto.
11. Quem utiliza: qualifica o público.
12. FAQ: remove objeções estratégicas.
13. CTA final: convida para conhecer uma nova forma de administrar.

## Sitemap

- `/`: landing principal.
- `/#problema`: problema e custo invisível.
- `/#sistema`: conceito, categoria e funcionamento.
- `/#usos`: casos de uso por perfil executivo.
- `/#impacto`: benefícios e público.
- `/#demonstracao`: CTA de demonstração.

## Fluxo de Navegação

Entrada -> entendimento em 30 segundos -> identificação do problema -> reclassificação mental do produto -> prova visual -> casos de uso -> redução de risco -> demonstração.

O visitante deve sair com três ideias:

- "Minha empresa depende demais da memória das pessoas."
- "Existe uma forma mais inteligente de operar."
- "O Neural OS parece uma categoria própria, não uma ferramenta comum."

## Wireframes Conceituais

### Hero

Layout em duas colunas no desktop, com copy dominante à esquerda e painel executivo à direita. Fundo em tempo real com uma rede viva formando um cérebro corporativo. No mobile, o texto assume a primeira dobra e a visualização permanece como profundidade.

### Problema

Título editorial grande, parágrafo curto e grade de sintomas executivos. Cada item surge como uma perda operacional silenciosa.

### Custo Invisível

Seção com contraste maior e simulação de perguntas dispersas. O visual deve transmitir desgaste, desalinhamento e demora.

### Sistema

Analogia em três blocos: computadores, iPhones, empresas. O terceiro bloco ganha destaque, criando o momento de categoria.

### Como Funciona

Coluna fixa com promessa e lista vertical de quatro transformações. A rolagem deve parecer uma sequência de clareza progressiva.

### Tudo Conectado

Grade de fontes comuns da empresa convergindo para uma frase de unificação. O objetivo é mostrar integração sem explicar tecnologia.

### Casos de Uso

Grade de seis cards executivos com ícones minimalistas. Cada card responde "onde isso cria valor agora?".

### Linha do Tempo

Faixa horizontal com etapas de implantação. A sensação deve ser de método, não improviso.

### Demonstração Visual

Console premium com pergunta de expansão empresarial, sinais de análise e resposta executiva. Não deve parecer chatbot; deve parecer centro de decisão.

### Benefícios

Quatro métricas conceituais. Não prometem números artificiais; reforçam mudança estrutural.

### FAQ

Accordion simples, direto e sem ruído visual.

### CTA Final

Texto centralizado, fundo profundo, convite para demonstração executiva.

## Design System

### Cores

- Preto profundo: `#030407`
- Grafite: `#080b10`, `#111620`
- Branco: `#f7fbff`
- Ciano elétrico: `#56e4ff`
- Azul de precisão: `#2e7dff`
- Violeta discreto: `#8c6dff`
- Prata textual: `#d9e7ef`

Uso: preto e grafite formam o palco; branco sustenta autoridade; ciano marca inteligência; azul e violeta aparecem apenas como profundidade.

### Tipografia

Família principal: Inter, Geist, Satoshi, IBM Plex Sans, Segoe UI.

Família display: Space Grotesk, Geist, Inter.

Regras:

- Headlines grandes, com peso e pouca explicação.
- Parágrafos curtos, com respiro.
- Microcopy objetiva, sem frases promocionais.
- Letter spacing sempre neutro no conteúdo longo.

### Espaçamento

- Seções principais: `py-28` a `py-32`.
- Container: `max-w-7xl`.
- Cards: raio máximo de `8px`.
- Densidade: premium, mas escaneável.

### Componentes

- Header translúcido.
- Botão magnético primário.
- Botão secundário em vidro.
- Cards executivos.
- Console de demonstração.
- Timeline horizontal.
- FAQ com details nativo.
- Visualização 3D em tempo real.

## Copywriting

### Headline Hero

"Sua empresa já tem pessoas. Está na hora de ter um cérebro."

### Subheadline

"O Neural OS organiza conhecimento, decisões e processos em uma inteligência corporativa que pertence à empresa, não à memória de cada pessoa."

### Mensagem de Categoria

"Windows organiza computadores. iOS organiza iPhones. Neural OS organiza empresas."

### Tese

O problema não é falta de software. É falta de uma inteligência central que preserve memória, coordene processos e dê continuidade à empresa.

## Motion Design

### Princípios

- Movimento sempre com função narrativa.
- Entrada suave, sem excesso performático.
- Parallax apenas para profundidade.
- Hover revela precisão e resposta.
- Scroll conduz a história de caos para clareza.

### Gatilhos

- Hero: rede neural viva renderizada em tempo real.
- Header: fixo, translúcido e silencioso.
- Cards do problema: entrada escalonada e linha superior em hover.
- Custo invisível: perguntas desalinhadas entrando lateralmente.
- Como funciona: blocos sobem conforme a leitura.
- Tudo conectado: tiles aparecem em sequência curta.
- Timeline: deslocamento horizontal durante scroll.
- Demonstração: etapas entram como uma análise executiva.
- FAQ: rotação do ícone no estado aberto.

### Performance

- Three.js com `dpr` limitado.
- Animações desativadas para usuários com redução de movimento.
- GSAP apenas para reveals e linhas.
- Lenis isolado no runtime cliente.
- Sem imagens externas obrigatórias.
- CSS leve, com gradientes lineares e texturas discretas.

## SEO Semântico

- Metadata principal no layout.
- JSON-LD de produto no `app/page.tsx`.
- `robots.ts` e `sitemap.ts`.
- Conteúdo em português brasileiro.
- Hierarquia semântica com `header`, `main`, `section`, `article`, `footer`.

## Linguagem Proibida na Interface

Evitar termos técnicos como LLM, RAG, embeddings, banco vetorial, grafo de conhecimento, prompt engineering e similares. Esses conceitos podem existir por trás, mas a página deve falar de memória, contexto, decisão, processos, governança e continuidade.
