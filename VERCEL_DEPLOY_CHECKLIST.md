# Vercel Deployment Checklist

Repository: `dimonsdavid-stack/tallyridge-assurance-2`
Branch: `main`
Root directory: repository root
Framework preset: Other
Build / install / output command: none
Environment variables: none required for the public GTM surface

Post-deploy checks:

1. `/` returns 200 and GuardState-derived visual system loads.
2. `/baseline/`, `/demo/`, `/scan/`, `/request/`, `/security/`, `/trust/` return 200.
3. `/api/health` returns `ok: true`, `version: 2.0.0`, and `dataMode: synthetic-only`.
4. `/data/demo-findings.csv` returns CSV.
5. `/.well-known/security.txt`, `/robots.txt`, and `/sitemap.xml` return 200.
6. Readiness scan produces a score locally.
7. Request builder generates, copies, and downloads a local brief.
8. Security headers include CSP, DENY framing, no-sniff, referrer policy, COOP/CORP, and permissions policy.
9. Vercel deployment is READY and `tallyridge-assurance-2.vercel.app` points to latest `main` commit.
