import { build } from 'esbuild';
import { mkdir, copyFile, cp, rm, writeFile } from 'node:fs/promises';
import { samplePDF } from './sample-pdfs.mjs';
await mkdir('assets', {recursive:true});
await build({entryPoints:['readiness/client.js'],bundle:true,format:'esm',platform:'browser',outfile:'assets/readiness.js',minify:true,legalComments:'eof'});
await copyFile('node_modules/pdfjs-dist/build/pdf.worker.min.mjs','assets/pdf.worker.min.mjs');
await build({entryPoints:['reconcile/client.js'],bundle:true,format:'esm',platform:'browser',outfile:'assets/reconcile.js',minify:true});

for (const folder of ["cmaps","standard_fonts","wasm"]) await cp(`node_modules/pdfjs-dist/${folder}`,`assets/${folder}`,{recursive:true});

await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
for(const file of ['index.html','404.html','styles.css','app.js','favicon.svg','robots.txt','sitemap.xml','site.webmanifest']) await copyFile(file,`dist/${file}`);
for(const folder of ['assets','baseline','demo','scan','request','security','trust','california','downloads','methodology','pricing','privacy','procurement','readiness','reconcile','data','.well-known']) await cp(folder,`dist/${folder}`,{recursive:true});
await writeFile('dist/downloads/sample-fee-schedule.pdf',samplePDF(['CivicReconcile - SYNTHETIC EXAMPLE ONLY','Adopted impact fee schedule - effective date January 1, 2025.','Transportation impact fee: $1,200 per supplied unit.','Nexus study and fee authority context are example phrases.','Not adopted by any agency. No legal or compliance conclusion.']));
await writeFile('dist/downloads/sample-acfr.pdf',samplePDF(['CivicReconcile - SYNTHETIC EXAMPLE ONLY','Annual Comprehensive Financial Report - example context.','Restricted fund balance and expenditures.','Annual impact fee report and five-year findings.','Not an agency financial statement. No compliance conclusion.']));
