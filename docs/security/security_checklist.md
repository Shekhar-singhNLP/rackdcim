# Security Posture (pre-launch checklist)

Reference framework: 5-prompt AI-builder security audit
(Gitleaks / Bearer / ECC Production Audit / Trail of Bits / attacker-
perspective review). Full prompt reference in `audit_prompts_reference.md`.

## Current stage: research prototype, no auth/payments/user PII yet
| Check | Status | Notes |
|---|---|---|
| Secrets in env vars, not code | ✅ Enforced | see `core/config.py`, `.env.example` |
| No hardcoded credentials | ✅ | device connection details via `.env` |
| Personal data flow | N/A | no user accounts yet |
| Auth / IDOR | N/A | no auth layer yet — required before any public API exposure |
| Rate limiting, CORS, security headers | ⏳ TODO | before public API deployment |
| Payment logic | N/A | no payments |

## Before any public/production deployment
Re-run all 5 prompts once auth, API exposure, or user data collection
is added — see `audit_prompts_reference.md`.