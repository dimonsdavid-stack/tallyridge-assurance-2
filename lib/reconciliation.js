export function parseCSV(text){
 if(text.length>8_000_000)throw new Error('CSV exceeds 8 MB text limit');
 const rows=[];let row=[],cell='',quoted=false;
 for(let i=0;i<text.length;i++){
  const c=text[i];
  if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else if(!quoted&&cell.length)throw new Error('Invalid CSV quote');else quoted=!quoted;}
  else if(c===','&&!quoted){row.push(cell);cell='';}
  else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(v=>v.trim()))rows.push(row);row=[];cell='';}
  else cell+=c;
 }
 if(quoted)throw new Error('Unterminated CSV quote');
 row.push(cell);if(row.some(v=>v.trim()))rows.push(row);
 if(!rows.length)throw new Error('CSV is empty');
 const header=rows.shift().map((v,i)=>v.replace(i===0?/^\uFEFF/:/$^/,'').trim());
 if(new Set(header).size!==header.length||header.some(v=>!v))throw new Error('Duplicate or empty column name');
 if(rows.length>25000)throw new Error('Maximum 25,000 records per local run');
 return rows.map((r,i)=>{if(r.length!==header.length)throw new Error(`Row ${i+2}: column count mismatch`);return Object.fromEntries(header.map((h,j)=>[h,r[j].trim()]));});
}
export function cents(value){if(!/^\d+(\.\d{1,2})?$/.test(value))throw new Error('Use nonnegative currency with at most two decimal places');const [w,f='']=value.split('.');return BigInt(w)*100n+BigInt(f.padEnd(2,'0'));}
function date(value){if(!/^\d{4}-\d{2}-\d{2}$/.test(value)||new Date(value+'T00:00:00Z').toISOString().slice(0,10)!==value)throw new Error('Invalid ISO date');return value;}
function quantity(value){if(!/^\d+(\.\d{1,6})?$/.test(value))throw new Error('Invalid quantity');const [w,f='']=value.split('.');return {n:BigInt(w+f),d:10n**BigInt(f.length)};}
export function amount(value){const n=BigInt(value);return `${n<0n?'-':''}${(n<0n?-n:n)/100n}.${String((n<0n?-n:n)%100n).padStart(2,'0')}`;}
export function reconcile(records,rules){
 const required=['record_id','assessment_date','fee_code','quantity','assessed','collected','credit','posted_fund'];
 const ruleFields=['fee_code','effective_from','effective_to','unit_rate','expected_fund'];
 if(!records.length||!rules.length)throw new Error('Both record and schedule rows are required');
 for(const field of required)if(!(field in records[0]))throw new Error(`Records missing ${field}`);
 for(const field of ruleFields)if(!(field in rules[0]))throw new Error(`Schedule missing ${field}`);
 const prepared=rules.map((r,i)=>{if(!r.fee_code||!r.expected_fund)throw new Error(`Schedule row ${i+2}: code and fund required`);date(r.effective_from);if(r.effective_to){date(r.effective_to);if(r.effective_to<=r.effective_from)throw new Error('Schedule end must follow start');}return {...r,rate:cents(r.unit_rate)};});
 const seen=new Map();records.forEach(r=>seen.set(r.record_id,(seen.get(r.record_id)||0)+1));
 return records.map((r,i)=>{
  const base={row:i+2,recordId:r.record_id,feeCode:r.fee_code,status:'REVIEW',findings:[],expected:null,assessmentDifference:null,collectionDifference:null};
  try{
   if(!r.record_id||!r.fee_code)throw new Error('Missing record ID or fee code');
   if(seen.get(r.record_id)>1)throw new Error('Duplicate record ID; excluded from comparisons');
   const day=date(r.assessment_date), q=quantity(r.quantity),assessed=cents(r.assessed),paid=cents(r.collected),credit=cents(r.credit);
   const match=prepared.filter(s=>s.fee_code===r.fee_code&&s.effective_from<=day&&(!s.effective_to||day<s.effective_to));
   if(match.length!==1)throw new Error(match.length?'Overlapping authority periods; staff must select applicable rule':'No applicable authority period');
   const s=match[0],gross=(s.rate*q.n+q.d/2n)/q.d;
   if(credit>gross)throw new Error('Credit exceeds calculated gross amount');
   const expected=gross-credit;
   base.expected=amount(expected);base.assessmentDifference=amount(expected-assessed);base.collectionDifference=amount(assessed-paid);
   if(expected!==assessed)base.findings.push(expected>assessed?'Assessment below supplied schedule':'Assessment above supplied schedule');
   if(paid!==assessed)base.findings.push(paid<assessed?'Assessed balance requires collection-timing review':'Collections exceed assessment; adjustment review');
   if(!r.posted_fund)base.findings.push('Fund posting not supplied');else if(r.posted_fund!==s.expected_fund)base.findings.push('Fund differs from supplied mapping');
   if(credit>0n)base.findings.push('Credit authority requires staff confirmation');
   base.status=base.findings.length?'REVIEW':'NO_EXCEPTION_IN_SUPPLIED_FIELDS';
  }catch(e){base.status='NOT_EVALUATED';base.findings=[e.message];}
  return base;
 });
}
export function csvCell(value){const text=String(value??'');const safe=/^[=+\-@\t\r]/.test(text)?'\''+text:text;return '"'+safe.replaceAll('"','""')+'"';}
export function resultsCSV(results){const keys=['row','recordId','feeCode','status','expected','assessmentDifference','collectionDifference','findings'];return [keys.join(','),...results.map(r=>keys.map(k=>csvCell(k==='findings'?r.findings.join('; '):r[k])).join(','))].join('\r\n');}
