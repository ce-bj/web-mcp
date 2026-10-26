import {availableAttrKeys, publicProducts} from './catalog.js';

/** Inputs only: copy the JSON into Inspector's Input Arguments after selecting the named tool. */
export function manualExamplesForPage({view,siteKey,product,form,rows=[],selectedProductId}){
  if(view==='products'){
    const first=publicProducts(siteKey)[0];
    const keyword=siteKey==='pipe'?'DN315 SN8':'6205-2RS';
    const selected=selectedProductId===undefined?first?.id:selectedProductId;
    return [
      {name:'search_products',purpose:'按名称或规格查找',args:{keyword}},
      {name:'open_product_detail',purpose:'用户确认后打开候选详情',args:selected?{productId:selected}:null,note:'先查到一款产品，才能打开详情。'}
    ];
  }
  if(view==='detail'){
    const keys=availableAttrKeys(product).slice(0,3);
    return [
      {name:'get_product_spec',purpose:'查询当前产品已开放的规格',args:keys.length?{fieldKeys:keys}:{}},
      {name:'check_lead_time',purpose:'查询当前产品标注的交期',args:{}},
      {name:'open_inquiry_form',purpose:'用户表示询价后打开表单',args:{}}
    ];
  }
  if(view==='quote'&&form?.webmcp){
    const values=siteKey==='pipe'?{
      contactName:'王宁',phone:'13800138000',email:'wang.ning@example.com',
      inquiryContent:`项目在江苏，计划采购 ${product.name} 约 1200 米，希望 12 月中旬发货。请确认能否满足目标日期，并提供第三方检测报告。`
    }:{quantity:200,contactName:'李工',email:'ligong@example.com',inquiryContent:'用于电机，请确认批量价格与交货期。'};
    const args={};
    if(form.multiItem)args.items=rows.map((row,index)=>({rowRef:row.ref,quantity:index===0?'1200 米':'200 米'}));
    for(const field of form.fields)if(values[field.key]!==undefined)args[field.key]=values[field.key];
    return [
      {name:'request_quote',purpose:'预填当前表单，待用户核对',args},
      {name:'submit_quote',purpose:'核对后提交当前表单并获取回执；执行时还需在页面确认',args:{},note:'先完成填写并核对；若页面出现确认框，请由用户亲自确认。'}
    ];
  }
  return [];
}
