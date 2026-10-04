# CivicReconcile launch verification

Verified 4 October 2026 against https://tallyridge-assurance-2.vercel.app/.

## Passed

- Node test suite: 10/10 passed. Cases include CSV quoting/shape, exact fractional cents, effective-date endpoints/overlap, duplicate IDs, invalid money, credit overflow, fund mismatch, spreadsheet formula injection and no compliance verdict from keyword context.
- Build succeeds on the configured Node 24 pipeline.
- Production deployment `dpl_Ak1gVnFRAmBBBKjx7B3pEpPYBjgA` reports READY for commit `f61bd06819468de56cfed0d0b66ae39a88c31a11`.
- Root, pricing, procurement, privacy, methodology, California, request, readiness, reconciliation, PDF sample and PDF worker routes return HTTP 200 with configured CSP headers.
- Health reports version 3.0.0 and configured private intake; production municipal data plane reports false.
- Synthetic intake returns 201 with receipt. Identical retry returns the same receipt; changed content under the same UUID returns 409. Wrong Origin returns 403. Unauthenticated retention returns 401.
- Browser CSV run: five sample records yielded three review rows, one not evaluated and one with no supplied-field exception. Table amounts and reasons agree with the sample. Clear removes results.
- Browser PDF run: both synthetic PDFs were extracted by the local worker; page-1 context references and an explicit not-located reporting result were returned. Clear removes files and results.
- No application-origin console error was observed in the tested PDF flow; the browser extension emitted unrelated errors during the session.
- Live registry recheck returned `available: true` for civicreconcile.com. It is not owned, reserved, registered or attached by this work.

## Limits of verification

- Generated Blob exports did not produce a download notification in this cloud browser. The export buttons and generation code are implemented; end-to-end export-file receipt is not verified. Static sample downloads were verified.
- Direct transfer of local fixtures into the remote browser stalled. Verification succeeded using the deployed synthetic sample downloads instead.
- Retention authentication rejection was verified; a successful scheduled deletion/90-day lifecycle was not observed in this new store.
- Rate saturation, concurrent high-load intake, outage recovery, browser compatibility, mobile layout and accessibility have not received comprehensive validation.
- A synthetic intake record is deliberately labeled as a deployment check and remains subject to the published retention policy. It is not a real inquiry.
- No actual agency audit, collected recovery, professional opinion, signed engagement, cooperative award or security authorization is evidence of this release.

The public release is a bounded launch, not a certified production municipal records system. Commission and assess authenticated workspaces and agency-data controls before processing such records on a server.
