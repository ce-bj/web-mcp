import test from 'node:test';
import assert from 'node:assert/strict';
import {sites,formDefinitions,publicProducts,getProduct,availableAttrKeys,specSchema,quoteSchema,searchCatalog} from './catalog.js';
import {manualExamplesForPage} from './manual-examples.js';

test('产品查找限定当前官网和公开产品',()=>{
  const pipe=searchCatalog('pipe','DN315 SN8 双壁波纹管');
  assert.deepEqual(pipe.items.map(p=>p.id),['pipe-315']);
  assert.equal(searchCatalog('bearing','DN315 SN8 双壁波纹管').total,0);
  assert.ok(!publicProducts('pipe').some(p=>p.id==='pipe-hidden'));
  assert.equal(getProduct('pipe','pipe-hidden'),undefined);
});

test('规格参数随产品模板切换且不暴露关闭字段',()=>{
  const pipe=specSchema(getProduct('pipe','pipe-315')).properties.fieldKeys.items.enum;
  const bearing=specSchema(getProduct('bearing','bearing-6205')).properties.fieldKeys.items.enum;
  assert.ok(pipe.includes('nominalDiameter'));
  assert.ok(!pipe.includes('weight'));
  assert.ok(bearing.includes('innerDiameter'));
  assert.ok(!bearing.includes('weight'));
  assert.notDeepEqual(pipe,bearing);
  assert.deepEqual(availableAttrKeys(getProduct('pipe','pipe-315')),pipe);
});

test('询价工具从当前 form 生成字段、类型和描述',()=>{
  const pipe=quoteSchema(formDefinitions.pipe,[{ref:'row_1',productId:'pipe-315'}]);
  assert.deepEqual(pipe.properties.items.items.properties.rowRef.enum,['row_1']);
  assert.equal(pipe.properties.phone.description,'采购联系人手机号');
  assert.ok(pipe.required.includes('phone'));
  const bearing=quoteSchema(formDefinitions.bearing);
  assert.equal(bearing.properties.items,undefined);
  assert.equal(bearing.properties.phone,undefined);
  assert.equal(bearing.properties.quantity.type,'integer');
  assert.equal(bearing.properties.quantity.minimum,1);
  assert.ok(bearing.required.includes('quantity'));
  assert.equal(sites.pipe.name,'澄川管业');
});

test('手动调用参数覆盖当前页工具并跟随表单行变化',()=>{
  const pipe=getProduct('pipe','pipe-315');
  const catalog=manualExamplesForPage({view:'products',siteKey:'pipe',product:pipe,form:formDefinitions.pipe});
  assert.deepEqual(catalog.map(x=>x.name),['search_products','open_product_detail']);
  assert.deepEqual(catalog[1].args,{productId:'pipe-315'});
  const detail=manualExamplesForPage({view:'detail',siteKey:'pipe',product:pipe,form:formDefinitions.pipe});
  assert.deepEqual(detail.map(x=>x.name),['get_product_spec','check_lead_time','open_inquiry_form']);
  assert.ok(detail[0].args.fieldKeys.every(key=>specSchema(pipe).properties.fieldKeys.items.enum.includes(key)));
  const rows=[{ref:'row_1',productId:'pipe-315'},{ref:'row_2',productId:'pipe-400'}];
  const quote=manualExamplesForPage({view:'quote',siteKey:'pipe',product:pipe,form:formDefinitions.pipe,rows})[0];
  assert.deepEqual(quote.args.items.map(item=>item.rowRef),['row_1','row_2']);
  const schema=quoteSchema(formDefinitions.pipe,rows);
  assert.ok(schema.required.every(key=>quote.args[key]!==undefined));
  const bearing=manualExamplesForPage({view:'quote',siteKey:'bearing',product:getProduct('bearing','bearing-6205'),form:formDefinitions.bearing})[0];
  assert.equal(bearing.args.quantity,200);
  assert.equal(bearing.args.items,undefined);
  assert.ok(quoteSchema(formDefinitions.bearing).required.every(key=>bearing.args[key]!==undefined));
});
