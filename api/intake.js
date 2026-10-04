import { put, get } from '@vercel/blob';
import { createHash, createHmac } from 'node:crypto';
const fields={agency:200,role:120,jurisdiction:200,workEmail:254,systems:600,scope:200,timing:100,context:3000,procurement:100};
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Method not allowed'});}
 const origin=req.headers.origin;
 const host=req.headers.host;
 if(!origin||!host||origin!==`https://${host}`)return res.status(403).json({error:'Origin rejected'});
 if(!String(req.headers['content-type']||'').startsWith('application/json'))return res.status(415).json({error:'JSON required'});
 const data=req.body;
 if(!data||typeof data!=='object'||Array.isArray(data)||Buffer.byteLength(JSON.stringify(data))>8000)return res.status(413).json({error:'Invalid request size'});
 if(data.website||data.consent!==true)return res.status(422).json({error:'Consent and valid request required'});
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.requestId||''))return res.status(422).json({error:'Invalid request ID'});
 if(!Number.isFinite(data.elapsedMs)||data.elapsedMs<2000)return res.status(422).json({error:'Please review your request before submitting'});
 const payload={};
 for(const [key,max] of Object.entries(fields)){
  if(typeof data[key]!=='string'||data[key].length>max)return res.status(422).json({error:'Invalid field'});
  payload[key]=data[key].trim();
 }
 if(!payload.agency||!payload.role||!payload.jurisdiction||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.workEmail))return res.status(422).json({error:'Complete agency, office, jurisdiction and email'});
 if(!process.env.BLOB_READ_WRITE_TOKEN)return res.status(503).json({error:'Intake unavailable; download your brief and retry later'});
 const digest=createHash('sha256').update(JSON.stringify(payload)).digest('hex');
 const path=`intake/${data.requestId}.json`;
 // Vercel supplies the forwarding header; raw IP is never retained.
 const ip=String(req.headers['x-vercel-forwarded-for']||req.headers['x-forwarded-for']||'unknown').split(',')[0].trim();
 const networkKey=createHmac('sha256',process.env.BLOB_READ_WRITE_TOKEN).update(ip).digest('hex');
 const bucket=Math.floor(Date.now()/900000);
 // Retry a saved request before consuming another rate slot.
 try { const old=await get(path,{access:'private'});if(old?.statusCode===200){const stored=JSON.parse(await new Response(old.stream).text());if(stored.digest!==digest)return res.status(409).json({error:'Request ID already used'});return res.status(201).json({accepted:true,requestId:data.requestId});} } catch { return res.status(503).json({error:'Request storage unavailable'}); }
 let reserved=false;
 for(let slot=0;slot<5;slot++){
  const ratePath=`rate/${bucket}/${networkKey}/${slot}.json`;
  try{await put(ratePath,JSON.stringify({receivedAt:new Date().toISOString()}),{access:'private',addRandomSuffix:false,allowOverwrite:false,contentType:'application/json'});reserved=true;break;}
  catch{try{const existing=await get(ratePath,{access:'private'});if(existing?.statusCode!==200)throw new Error('unavailable');}catch{return res.status(503).json({error:'Rate service unavailable'});}}
 }
 if(!reserved){res.setHeader('Retry-After','900');return res.status(429).json({error:'Too many requests. Retry in 15 minutes or download your brief.'});}

 try{
  await put(path,JSON.stringify({schemaVersion:1,id:data.requestId,receivedAt:new Date().toISOString(),digest,payload,consent:true,status:'NEW'}),{access:'private',addRandomSuffix:false,allowOverwrite:false,contentType:'application/json'});
 }catch{
  try{
   const existing=await get(path,{access:'private'});
   if(!existing||existing.statusCode!==200)throw new Error('Unavailable');
   const stored=JSON.parse(await new Response(existing.stream).text());
   if(stored.digest!==digest)return res.status(409).json({error:'Request changed; submit with a new ID'});
  }catch{return res.status(503).json({error:'Could not save request. Download your brief or retry.'});}
 }
 return res.status(201).json({accepted:true,requestId:data.requestId});
}
