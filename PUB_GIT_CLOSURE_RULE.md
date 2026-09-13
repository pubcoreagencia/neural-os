# PUB Git Stage Closure Rule

**Effective:** 2026-09-13 | **Status:** Mandatory

A stage is **CLOSED / COMPLETE / PASS** only after implementation, required tests/gates, clean working tree, commit, publication to the official remote, and post-push verification that GitHub reflects the intended state. A local commit alone never closes a stage.

Required sequence: `IMPLEMENT → TEST → COMMIT → PUSH → VERIFY REMOTE → DECLARE CLOSED → NEXT STAGE`

If publication is intentionally withheld, record **IMPLEMENTED LOCALLY / NOT YET PUBLISHED** and do not call the stage complete. Before the next stage, verify the previous stage's remote commit. GitHub is the source of truth.
