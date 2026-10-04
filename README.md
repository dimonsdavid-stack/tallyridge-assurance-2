# CivicReconcile

Municipal fee review: public-document readiness, deterministic local record comparison, and private review-request intake.

## Production URL

https://tallyridge-assurance-2.vercel.app

## Design system

The public visual system intentionally follows the GuardState production design benchmark: navy/cyan enterprise palette, Inter/system typography, compact monospace operational labels, dark hero and control-console surfaces, light evidence sections, and bounded institutional claims.

## Public routes

- `/` — GTM landing page
- `/baseline/` — Impact Fee Assurance Baseline
- `/demo/` — synthetic finding register
- `/scan/` — local assurance readiness scan
- `/request/` — local brief builder and explicit private request submission
- `/readiness/` — browser-local public PDF context check
- `/reconcile/` — browser-local effective-dated CSV reconciliation
- `/pricing/`, `/methodology/`, `/california/`, `/procurement/`, `/privacy/`
- `/security/` — security & architecture posture
- `/trust/` — trust / procurement posture
- `/api/health` — deployment health
- `/.well-known/security.txt`
- `/robots.txt`
- `/sitemap.xml`

## Deployment boundary

Public PDF and CSV tools keep document contents in the browser. The intake API stores contact and scope metadata in a private Vercel Blob store. No authenticated municipal workspace, production agency upload, ERP connection, legal opinion, licensed accounting engagement, signed approval ledger, SOC 2 report, FedRAMP authorization or existing cooperative award is represented. Commission these separately with contracts, evidence and an authorized operating team.

## Run and verify

Node 24: `npm ci`, `npm test`, `npm run build`. Serve `dist` for static previews. Vercel serves Node API functions under `/api`; a static server does not emulate them.

## Private intake operations

Required variables: `BLOB_READ_WRITE_TOKEN` for a **private** store; `CRON_SECRET` for the daily retention job. Never expose either to client code. Intake checks same-origin, method, content type, size, consent, lengths and required fields. Atomic private reservations cap each network at five new requests per 15-minute bucket. Matching UUID retries return the same receipt; changed payloads conflict. This is bounded abuse protection, not bot-proof authentication. Retention deletes intake older than 90 days and rate slots older than 48 hours.

An authorized operator must review private `intake/` entries and arrange responses. This release does not send email, run a CRM, accept engagements, or promise an SLA. Monitor failed intake and retention responses. Preview deployments share the provisioned store unless separate stores are configured. Clearly label synthetic verification.

## Commercial implementation record

See [docs/LAUNCH_BLUEPRINT.md](docs/LAUNCH_BLUEPRINT.md) and [docs/forecast.csv](docs/forecast.csv). Forecasts are assumptions, not traction. `civicreconcile.com` was registry-available during implementation; it is not registered or attached. Canonical URLs retain the existing Vercel host until domain ownership is established.
