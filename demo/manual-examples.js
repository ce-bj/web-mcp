import {availableAttrKeys, publicProducts} from './catalog.js';

/** Inputs only: copy the JSON into Inspector's Input Arguments after selecting the named tool. */
export function manualExamplesForPage({view,siteKey,product,form,rows=[],selectedProductId}){
  if(view==='discover')return [
    {name:'search_suppliers',purpose:'按采购需求搜索候选供应商官网',args:{query:'湖北 城市供水 PVC-U 给水管 dn110 1.6MPa 生产厂家 环保认证'}},
    {name:'inspect_supplier',purpose:'进入前核实候选官网的公开信号',args:{siteId:'goody'}},
    {name:'open_supplier_site',purpose:'用户确认后进入官网',args:{siteId:'goody'}}
  ];
  if(siteKey==='goody')return goodyExamples({view,product,selectedProductId});
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

const goodyGlobal=selectedProductId=>[
  {name:'get_company_info',purpose:'确认公司身份、资质与生产基地',args:{topics:['profile','organization','honors']}},
  {name:'search_products',purpose:'按关键词和分类查找产品',args:{keyword:'PVC 给水管',categoryId:'water'}},
  {name:'open_product_detail',purpose:'用户确认后打开候选详情',args:selectedProductId===null?null:{productId:selectedProductId||'pvcu-uh-water'},note:selectedProductId===null?'先查到一款产品，才能打开详情。':''},
  {name:'open_site_page',purpose:'打开固定页面；没有留资表单的页面用它跳转到在线留言页',args:{page:'message'}}
];
function goodyExamples({view,product,selectedProductId}){
  const contact={contactName:'王宁',phone:'13800138000',email:'wang.ning@example.com'};
  const submitNote='先完成填写并核对；页面出现确认框时由用户确认。';
  if(view==='detail')return [
    {name:'get_product_detail',purpose:'读取当前产品的规格表与认证',args:{sections:['specTables','certifications']}},
    {name:'request_quote',purpose:'预填“产品咨询”表单，待用户核对',args:{...contact,region:'湖北武汉',inquiryContent:`咨询 ${product.name}：dn110、1.6MPa，约 2000 米，项目在湖北武汉，希望 12 月中旬供货。请确认价格、交期，并提供检测报告。`}},
    {name:'submit_quote',purpose:'核对后提交并取得结果；执行时还需页面确认',args:{},note:submitNote},
    ...goodyGlobal(selectedProductId).slice(0,2)
  ];
  // 只有在线留言页有通用留资表单；其余页面没有留资工具，用 open_site_page 跳转到在线留言页。
  if(view!=='message')return goodyGlobal(selectedProductId);
  const fill={name:'request_message',purpose:'预填“在线留言”表单，待用户核对',args:{...contact,message:'需要 DN1000 以上的市政排水管约 500 米，也想了解工程合作和经销政策，请联系我。'}};
  return [fill,{name:'submit_message',purpose:'核对后提交并取得结果；执行时还需页面确认',args:{},note:submitNote},...goodyGlobal(selectedProductId)];
}
