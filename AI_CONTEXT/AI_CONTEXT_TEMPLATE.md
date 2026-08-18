# AI_CONTEXT_TEMPLATE — PORTABLE CONTINUITY STANDARD

Este documento define o padrão oficial de continuidade portátil para projetos da PUB Holding.

## Finalidade do AI_CONTEXT

O `AI_CONTEXT/` existe para registrar, dentro do próprio repositório, o contexto necessário para continuar o projeto sem depender de conversa, conta, sessão, computador, IDE ou agente específico.

## Princípio de portabilidade

Se o conhecimento é necessário para continuar o projeto, ele deve existir no próprio projeto.

## Source of truth

- Código real: verdade da implementação.
- Documentação do projeto: verdade documental.
- `AI_CONTEXT/`: camada portátil operacional.
- Git: histórico de mudanças.
- Conversas: contexto temporário, nunca única fonte de verdade.

## Estrutura mínima recomendada

- `00_START_HERE.md`
- `01_MASTER_CONTEXT.md`
- `02_ARCHITECTURE_BASELINE.md`
- `03_CURRENT_STATE.md`
- `04_DOMAIN_MODEL.md`
- `05_TECHNICAL_CONTEXT.md` ou equivalente
- `06_INFRASTRUCTURE.md` ou equivalente
- `07_DECISIONS.md`
- `08_OPEN_BLOCKERS.md`
- `09_ROADMAP.md`
- `10_TESTS_AND_GATES.md`
- `11_SECURITY.md` quando aplicável
- `12_AI_HANDOFF.md`

Projetos menores podem usar menos arquivos.

## Função de cada arquivo

- `00_START_HERE.md`: ponto de entrada obrigatório.
- `01_MASTER_CONTEXT.md`: consolida o contexto institucional e técnico principal.
- `02_ARCHITECTURE_BASELINE.md`: arquitetura congelada.
- `03_CURRENT_STATE.md`: estado real atual do código e da documentação.
- `04_DOMAIN_MODEL.md`: domínio, entidades, relações e limites.
- `05_TECHNICAL_CONTEXT.md`: detalhes técnicos relevantes.
- `06_INFRASTRUCTURE.md`: infraestrutura, integrações e dependências.
- `07_DECISIONS.md`: decisões arquiteturais congeladas.
- `08_OPEN_BLOCKERS.md`: blockers reais.
- `09_ROADMAP.md`: próxima fase e ordem de execução.
- `10_TESTS_AND_GATES.md`: testes, gates e critérios de pronto.
- `11_SECURITY.md`: riscos e controles quando necessário.
- `12_AI_HANDOFF.md`: guia operacional para retomada por outra IA.

## Regra de atualização

Atualize o contexto portátil sempre que houver mudança relevante de:

- arquitetura
- domínio
- infraestrutura
- contratos
- estado de produção
- blockers
- gates
- roadmap
- decisões arquiteturais

## Como uma nova IA deve iniciar

1. Ler `00_START_HERE.md`.
2. Ler os arquivos indicados.
3. Inspecionar o código real.
4. Verificar `git status`.
5. Verificar gates relevantes.
6. Comparar documentação com implementação.
7. Identificar divergências.
8. Só então propor ou executar mudanças.

## Como registrar decisões

- Escreva a decisão com data ou contexto suficiente.
- Diga se ela é congelada, provisória ou sob revisão.
- Diferencie claramente o que foi adotado, o que foi rejeitado e o que permanece opcional.

## Como registrar blockers

- Registre apenas blockers reais.
- Descreva o impacto objetivo.
- Indique a dependência externa ou condição necessária para avançar.

## Como registrar estado atual

- Descreva somente o que o código e a documentação realmente mostram.
- Não misture intenção com implementação.
- Destaque divergências quando existirem.

## Como preparar handoff

- Resuma fase atual, gate, blockers, próxima ação e decisões congeladas.
- Aponte para os arquivos reais que permitem retomar o trabalho.
- Inclua o estado do Git quando o handoff for preparado.

## Regra sobre documentação existente

O `AI_CONTEXT/` complementa a documentação técnica existente. Ele não deve apagar nem substituir documentação legítima já presente no projeto.

