import test from 'node:test';
import assert from 'node:assert/strict';
import {saveDemoInquiry} from './submission.js';

function memoryStorage(){
  const values=new Map();
  return {
    getItem:key=>values.get(key)??null,
    setItem:(key,value)=>values.set(key,value),
    records:()=>JSON.parse(values.get('webmcp-demo-inquiries')||'[]')
  };
}

const draft={site:'pipe',formId:'inquiry-pipe',productIds:['pipe-315'],items:[{rowRef:'row_1',productId:'pipe-315',quantity:'1200 米'}],fields:{contactName:'王宁',phone:'13800138000',email:'wang.ning@example.com',inquiryContent:'请确认交期。'}};

test('提交成功返回本地回执，重复调用复用同一条记录',()=>{
  const storage=memoryStorage();
  const first=saveDemoInquiry(draft,{storage,createId:()=> 'DEMO-001',now:()=>new Date('2026-10-26T10:00:00.000Z')});
  assert.equal(first.status,'submitted');
  assert.equal(first.receipt.id,'DEMO-001');
  assert.equal(first.receipt.submittedAt,'2026-10-26T10:00:00.000Z');
  assert.equal(first.receipt.mode,'demo_local');
  assert.equal(storage.records().length,1);
  assert.deepEqual(storage.records()[0].items,draft.items);

  const repeated=saveDemoInquiry(draft,{storage,previous:first,createId:()=> 'DEMO-002'});
  assert.equal(repeated.receipt.id,'DEMO-001');
  assert.equal(repeated.reused,true);
  assert.equal(storage.records().length,1);

  const changed=saveDemoInquiry({...draft,fields:{...draft.fields,inquiryContent:'请确认交期及检测报告。'}},{storage,previous:first,createId:()=> 'DEMO-002'});
  assert.equal(changed.receipt.id,'DEMO-002');
  assert.equal(storage.records().length,2);
});

test('存储结果不确定时不伪造成功回执',()=>{
  const result=saveDemoInquiry(draft,{storage:{getItem:()=> '[]',setItem:()=>{throw new Error('storage unavailable');}},createId:()=> 'DEMO-001'});
  assert.equal(result.status,'unknown');
  assert.equal(result.receipt,undefined);
});
