import { list, del } from '@vercel/blob';
export const config={maxDuration:60};
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'});
 if(!process.env.CRON_SECRET||req.headers.authorization!==`Bearer ${process.env.CRON_SECRET}`)return res.status(401).json({error:'Unauthorized'});
 let cursor,deleted=0,pages=0;
 try{do{const page=await list({cursor,limit:1000});const now=Date.now();const expired=page.blobs.filter(b=>(b.pathname.startsWith('rate/')&&now-new Date(b.uploadedAt).getTime()>48*3600000)||(b.pathname.startsWith('intake/')&&now-new Date(b.uploadedAt).getTime()>90*86400000));if(expired.length){await del(expired.map(b=>b.url));deleted+=expired.length;}cursor=page.hasMore?page.cursor:undefined;pages++;}while(cursor&&pages<20);return res.status(200).json({ok:true,deleted,remainingPages:Boolean(cursor)});}catch{return res.status(503).json({ok:false,error:'Retention job failed'});}
}
