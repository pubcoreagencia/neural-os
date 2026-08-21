<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## AI Continuity — Persistence First

**The repository is the durable source of truth for project evolution.** A conversation, session, model, account, workstation, or AI tool must never be the only place where project-critical knowledge exists.

Every AI working on this project must, when it has repository write access:

1. Read the repository's current context before making changes.
2. Materialize meaningful evolution in Git: code, tests, architecture, decisions, business rules, contracts, security constraints, status, blockers, and handoff/resume instructions as applicable.
3. Validate the change.
4. Update the relevant context/handoff documentation.
5. Commit the evolution and push it or open a pull request.
6. Verify that the required state is persisted before ending the session.

A session is **not complete** merely because the code works locally or the result was explained in chat. The next AI or developer must be able to continue from the repository without depending on the previous conversation.

If write access or connectivity is unavailable, explicitly record the persistence blocker and leave the work recoverable; never claim that an evolution was persisted when it was not.

The full protocol is documented in [`docs/AI_CONTINUITY_PROTOCOL.md`](docs/AI_CONTINUITY_PROTOCOL.md).
