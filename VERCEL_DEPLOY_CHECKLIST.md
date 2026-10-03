# Vercel Deployment Checklist

Source repository: `dimonsdavid-stack/arclenos-guardstate-recovered`
Production branch: `tallyridge-clean`
Root directory: repository root (blank)
Framework: Other
Build / Output / Install commands: blank
Environment variables: none required

After deployment verify `/`, `/baseline/`, `/demo/`, `/security/`, `/data/demo-findings.csv`, and `/api/health`.

The health endpoint must return HTTP 200 with `"ok": true` and `"dataMode": "synthetic-only"`.
