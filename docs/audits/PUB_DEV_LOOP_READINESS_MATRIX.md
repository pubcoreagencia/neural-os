# PUB Dev Loop Readiness Matrix

| Repo | Produto | Estado | Build | Test | Security | Git | Docs | Agent Ready | DEV LOOP Ready | Score | Blockers |
| ---- | ------- | ------ | ----- | ---- | -------- | --- | ---- | ----------- | -------------- | ----- | -------- | 
| PUB NEURAL OS | Memory / holding brain | NEEDS HARDENING | PASS | PASS | PARTIAL | OK | GOOD | PARTIAL | READY WITH MINOR FIXES | 7.5 | PostgreSQL real, vector store real, runtime audit/permissions |
| PUB MACHINE | CRM / sales ops | NEEDS HARDENING | UNKNOWN | UNKNOWN | UNKNOWN | OK | PARTIAL | PARTIAL | UNKNOWN | 5.0 | No evidence of test/typecheck script in this scan |
| PUB MACHINE 2 | CRM / sales ops v2 | NEEDS HARDENING | UNKNOWN | UNKNOWN | UNKNOWN | OK | PARTIAL | PARTIAL | UNKNOWN | 5.0 | No evidence of test/typecheck script in this scan |
| PUB START | landing / acquisition | READY WITH MINOR FIXES | PASS | UNKNOWN | UNKNOWN | OK | PARTIAL | LOW | READY WITH MINOR FIXES | 6.5 | No test/typecheck script, deploy coupling to Cloudflare preview |
| PUB SCRAPPING | scraping / support | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | OK | UNKNOWN | UNKNOWN | UNKNOWN | 3.0 | Not enough local evidence in this scan |
| pub-core-holding-portal | holding portal | READY WITH MINOR FIXES | PASS | UNKNOWN | UNKNOWN | OK | PARTIAL | PARTIAL | READY WITH MINOR FIXES | 6.5 | `lint` is only `tsc --noEmit` in current manifest |
| leadcore | lead ops / turso | NEEDS HARDENING | PASS | NONE | PARTIAL | OK | PARTIAL | PARTIAL | READY WITH MINOR FIXES | 6.0 | `test` is placeholder, production data flow needs hardening |
| pub-dev-loop | execution loop | NEEDS HARDENING | PASS | PASS | PARTIAL | OK | PARTIAL | HIGH | READY | 7.0 | Externalized runtime/config assumptions, limited local evidence only |

## Notes

- This matrix covers only repos discovered locally in the current machine scan.
- `UNKNOWN` means the repo was not inspected deeply enough in this environment.
- A repo is not marked ready just because it has Git and a build script.

