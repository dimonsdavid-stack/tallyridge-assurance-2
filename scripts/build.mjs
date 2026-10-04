import { build } from 'esbuild';
import { mkdir, copyFile, cp, rm } from 'node:fs/promises';
await mkdir('assets', {recursive:true});
await build({entryPoints:['readiness/client.js'],bundle:true,format:'esm',platform:'browser',outfile:'assets/readiness.js',minify:true,legalComments:'eof'});
await copyFile('node_modules/pdfjs-dist/build/pdf.worker.min.mjs','assets/pdf.worker.min.mjs');
await build({entryPoints:['reconcile/client.js'],bundle:true,format:'esm',platform:'browser',outfile:'assets/reconcile.js',minify:true});

for (const folder of ["cmaps","standard_fonts","wasm"]) await cp(`node_modules/pdfjs-dist/${folder}`,`assets/${folder}`,{recursive:true});

await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
for(const file of ['index.html','404.html','styles.css','app.js','favicon.svg','robots.txt','sitemap.xml','site.webmanifest']) await copyFile(file,`dist/${file}`);
for(const folder of ['assets','baseline','demo','scan','request','security','trust','california','downloads','methodology','pricing','privacy','procurement','readiness','reconcile','data','.well-known']) await cp(folder,`dist/${folder}`,{recursive:true});
