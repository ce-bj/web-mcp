const storageKey='webmcp-demo-inquiries';

export function saveDemoInquiry(draft,{storage,previous,createId=()=>`DEMO-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,8).toUpperCase()}`,now=()=>new Date()}={}){
  const signature=JSON.stringify(draft);
  if(previous?.status==='submitted'&&previous.signature===signature)return {...previous,reused:true};
  try{
    const existing=JSON.parse(storage.getItem(storageKey)||'[]');
    if(!Array.isArray(existing))throw new Error('Invalid inquiry storage');
    const id=createId();
    const submittedAt=now().toISOString();
    const record={id,...draft,createdAt:submittedAt};
    storage.setItem(storageKey,JSON.stringify([...existing,record]));
    return {status:'submitted',signature,reused:false,receipt:{id,submittedAt,mode:'demo_local',site:draft.site,formId:draft.formId,productIds:draft.productIds}};
  }catch{
    return {status:'unknown',message:'本地演示存储不可用，本次提交结果无法确认；请先不要重复提交。'};
  }
}
