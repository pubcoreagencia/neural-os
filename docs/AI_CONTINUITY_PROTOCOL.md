# AI Continuity & Persistence Protocol

## Purpose

PUB Neural OS treats the repository as the durable continuity layer for AI-assisted development. A conversation, session, model, account, workstation, or tool must never be the only place where project-critical knowledge exists.

## Persistence-First Rule

Any AI that makes a meaningful change to a project must materialize the resulting evolution in the project's Git repository whenever the AI has repository write access.

The durable project state includes, when applicable:

- source code and tests;
- architecture and technical decisions;
- business rules and product requirements;
- database and API contracts;
- security decisions and constraints;
- current phase/status;
- blockers and known risks;
- operational instructions;
- handoff/resume information needed by another AI or developer.

The conversation is a working interface, not the system of record.

## Required Lifecycle

```text
READ REPOSITORY CONTEXT
        ↓
UNDERSTAND CURRENT STATE
        ↓
IMPLEMENT / CHANGE
        ↓
VALIDATE
        ↓
UPDATE CONTEXT / HANDOFF
        ↓
COMMIT
        ↓
PUSH / PR
        ↓
VERIFY PERSISTED STATE
        ↓
READY FOR NEXT AI
```

## Session Completion Rule

A session is not considered complete merely because code works locally or the AI has explained the result in chat. Before ending a development session, the AI should persist all information required to reproduce, review, or continue the evolution.

If repository write access, connectivity, or another required capability is unavailable, the AI must explicitly record the blocker and leave the work in a recoverable state rather than claiming that the evolution has been persisted.

## Source of Truth

Git is the durable source of truth for project evolution. Project-specific master context and handoff documents are part of that source of truth. The exact filenames may vary by repository, but every project must have a clear entry point explaining where its current context, architecture, status, blockers, and resume instructions live.

## No Lost Evolution

Do not rely on:

- chat history;
- model memory;
- a specific AI provider;
- a specific account or session;
- a developer's local machine;
- an uncommitted workspace;
- undocumented decisions.

If a fact is required for future continuity, materialize it in the repository.

## Handoff Standard

A new AI or developer should be able to enter the repository, read the documented entry point, inspect the current Git state, and continue without needing the previous conversation.

The repository should therefore answer at minimum:

1. What is this project?
2. What is the current architecture?
3. What has been implemented?
4. What is currently being changed?
5. What decisions and constraints must be preserved?
6. What remains blocked or unfinished?
7. What is the next safe step?

## Change Discipline

Do not rewrite published history merely to improve documentation. Preserve auditability. Prefer normal commits and pull requests. Risky changes require the project's existing review and approval process.
