const groups=[
 {id:'authority',label:'Adopted fee authority',terms:[/impact fee/i,/development fee/i,/effective date/i,/resolution/i,/ordinance/i],next:'Confirm the adopted resolution, fee program and effective dates. A keyword is not evidence of legal applicability.'},
 {id:'funds',label:'Restricted-fund context',terms:[/restricted/i,/capital project/i,/impact fee/i,/development fee/i,/fund balance/i],next:'Obtain the fee-program-to-fund crosswalk and detailed general ledger. ACFR categories alone do not establish correct posting.'},
 {id:'reporting',label:'Annual fee-report context',terms:[/66006/,/mitigation fee/i,/annual report/i,/interest earned/i],next:'Locate the separate annual development-fee report and supporting fund schedules; an ACFR may not contain them.'},
 {id:'findings',label:'Five-year findings context',terms:[/66001/,/five.year/i,/unexpended/i,/nexus/i],next:'Locate applicable five-year findings, nexus study, improvement financing and agency counsel review.'}
];
export function analyzeDocuments(documents){return groups.map(g=>{const hits=[];for(const d of documents)for(const p of d.pages)if(g.terms.some(t=>t.test(p.text)))hits.push({document:d.kind,page:p.page,excerpt:p.text.replace(/\s+/g,' ').slice(0,220)});return {id:g.id,label:g.label,status:hits.length?'CONTEXT_LOCATED':'NOT_LOCATED_IN_SUPPLIED_TEXT',hits:hits.slice(0,8),next:g.next};});}
