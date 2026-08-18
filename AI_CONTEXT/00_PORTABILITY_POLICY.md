# 00_PORTABILITY_POLICY — PUB HOLDING CONTINUITY LAW

Política oficial:

“Se o conhecimento é necessário para continuar o projeto, ele deve existir no próprio projeto.”

Nome oficial:

- PUB HOLDING — LEI DE CONTINUIDADE PORTÁTIL

Objetivo:

- garantir que qualquer IA, conta, computador, IDE ou fornecedor possa retomar o projeto sem depender do histórico de conversa

Princípios:

1. Código real é a verdade da implementação.
2. Documentação do projeto é a verdade documental.
3. `AI_CONTEXT/` é a camada portátil operacional.
4. Git é o histórico de mudanças.
5. Conversas são contexto temporário, nunca fonte única de verdade.

Obrigação para cada projeto PUB:

- manter `AI_CONTEXT/`
- ter `AI_CONTEXT/00_START_HERE.md`
- registrar estado real, decisões, blockers, testes, gates e próxima ação

O que esta política não faz:

- não substitui a documentação técnica existente
- não altera arquitetura funcional
- não implementa comportamento novo

Quando atualizar:

- sempre que houver mudança relevante de arquitetura, domínio, infraestrutura, contratos, estado de produção, blockers, gates, roadmap ou decisões arquiteturais

Teste de conformidade:

- uma nova IA deve conseguir clonar o repositório
- ler `AI_CONTEXT/00_START_HERE.md`
- inspecionar o código real
- verificar `git status`
- entender arquitetura, estado atual, blockers e próxima ação
- continuar com segurança

