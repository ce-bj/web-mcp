import {sites,formDefinitions,publicProducts,getProduct,fieldDescription,availableAttrKeys,specSchema,quoteSchema,searchCatalog} from './catalog.js';
import {manualExamplesForPage} from './manual-examples.js';
import {saveDemoInquiry} from './submission.js';
import {suppliers,searchSuppliers,inspectSupplier,signalsFor,goodyIssues,GOODY_SNAPSHOT_DATE,GOODY_URL,GOODY_PRODUCT_URL} from './discovery.js';
import {goodySite,goodyProducts,goodyProduct,leadFormFor} from './goody-data.js';
import {createGoodyPages,GOODY_VIEWS,goodyPrompts,goodyPromptIntro} from './goody-views.js';

const $=selector=>document.querySelector(selector);
const params=new URLSearchParams(location.search);
const route={view:params.get('view')||'discover',site:params.get('site')||'pipe',product:params.get('product')||'',category:params.get('category')||''};
if(route.view==='compare')route.view='discover';
const isGoody=route.site==='goody';
if(!sites[route.site]&&!isGoody)route.site='pipe';
if(route.view!=='discover'&&!(isGoody?GOODY_VIEWS:['products','detail','quote']).includes(route.view))route.view=isGoody?'home':'discover';
// 默认展示一期修正后的发现层信号；?meta=current 对照演示站当前快照。
const metaMode=params.get('meta')==='current'?'current':'fixed';
const site=isGoody?goodySite:sites[route.site];
const product=isGoody?(goodyProduct(route.product)||goodyProducts[0]):(getProduct(route.site,route.product)||publicProducts(route.site)[0]);
const lead=isGoody?leadFormFor(route.view):null;
const form=isGoody?(lead.form||null):formDefinitions[route.site];
const goodyTitles={home:'首页',company:'关于顾地',contact:'联系我们',products:'产品中心',detail:product.name,message:'在线留言'};
document.title=route.view==='discover'?'发现与选择 · WebMCP 询价演示':isGoody?`${goodyTitles[route.view]}｜顾地科技 · 塑料管道系统生产厂家`:`${site.name}｜${({products:'所有产品',detail:product.name,quote:form.title})[route.view]}`;
const pageUrl=(view,siteKey=route.site,productId='')=>view==='discover'?discoverUrl():`./index.html?view=${view}&site=${siteKey}${productId?`&product=${encodeURIComponent(productId)}`:''}`;
const discoverUrl=(mode=metaMode)=>`./index.html?view=discover${mode==='current'?'&meta=current':''}`;
const DISCOVER_QUERY='我在湖北做城市供水项目，需要 PVC-U 给水管 dn110、1.6MPa，约 2000 米。要求是生产厂家，有环保或卫生相关认证。';
const demoFileUrl=file=>new URL(file,import.meta.url).href;
const e=(v)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const urlForProduct=(id)=>new URL(pageUrl('detail',route.site,id),location.href).href;
let rows=[];
let toolController=null;
let registered=[];
let registerSerial=0;
let selectedSearchProductId;
let currentManualExamples=[];
let lastSubmission=null;
const inquiryStorage={getItem:key=>localStorage.getItem(key),setItem:(key,value)=>localStorage.setItem(key,value)};

function icon(name){
  const paths={search:'<circle cx="11" cy="11" r="7"/><path d="m16 16 4 4"/>',arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',check:'<path d="m4 12 5 5L20 6"/>',box:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 9v12"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>',doc:'<path d="M6 2h8l4 4v16H6zM14 2v5h4M9 12h6M9 16h6"/>',send:'<path d="m3 11 18-8-8 18-2-8-8-2zM11 13l10-10"/>',external:'<path d="M14 3h7v7M10 14 21 3M20 14v7H3V4h7"/>',chevron:'<path d="m9 6 6 6-6 6"/>',layers:'<rect x="4" y="4" width="13" height="13" rx="2"/><path d="M8 20h12V8"/>'};
  return `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.box}</svg>`;
}

function navItem(label,href,active,small=''){
  return `<a class="nav-item ${active?'active':''}" href="${href}" ${active?'aria-current="page"':''}><span>${e(label)}</span>${small?`<small>${e(small)}</small>`:''}</a>`;
}
function renderShell(){
  document.body.dataset.site=route.view==='discover'?'neutral':route.site;
  const currentLabel=route.view==='discover'?'发现与选择':isGoody?goodyTitles[route.view]:route.view==='products'?'全部产品':route.view==='detail'?'产品详情':'在线询价';
  const g=view=>isGoody&&route.view===view;
  $('#app').innerHTML=`
    <aside class="sidebar" aria-label="演示页面切换">
      <div class="side-logo"><span class="logo-mark">W</span><div><strong>WebMCP Lab</strong><span>询价场景演示 · 0.x</span></div></div>
      <div class="nav-group"><p>体验起点</p>${navItem('多家公司 · 发现与选择',discoverUrl(),route.view==='discover','search_suppliers')}</div>
      <div class="nav-group"><p><span class="nav-dot goody-dot"></span> 顾地科技 · 一期演示</p>
        ${navItem('官网首页',pageUrl('home','goody'),g('home'),'公司 · 查找')}
        ${navItem('产品中心',pageUrl('products','goody'),g('products'),'search_products')}
        ${navItem('产品详情',pageUrl('detail','goody','pvcu-uh-water'),g('detail'),'规格 · 留资')}
        ${navItem('关于顾地',pageUrl('company','goody'),g('company')||g('contact'),'get_company_info')}
        ${navItem('在线留言',pageUrl('message','goody'),g('message'),'留言 · 提交')}
      </div>
      <p class="nav-section">通用需求原型</p>
      <div class="nav-group"><p><span class="nav-dot pipe-dot"></span> 澄川管业</p>
        ${navItem('所有产品',pageUrl('products','pipe'),route.view==='products'&&route.site==='pipe','search_products')}
        ${navItem('产品详情',pageUrl('detail','pipe','pipe-315'),route.view==='detail'&&route.site==='pipe','规格 · 交期')}
        ${navItem('在线询价',pageUrl('quote','pipe','pipe-315'),route.view==='quote'&&route.site==='pipe','预填 · 提交')}
      </div>
      <div class="nav-group"><p><span class="nav-dot bearing-dot"></span> 衡星精密</p>
        ${navItem('所有产品',pageUrl('products','bearing'),route.view==='products'&&route.site==='bearing','search_products')}
        ${navItem('产品详情',pageUrl('detail','bearing','bearing-6205'),route.view==='detail'&&route.site==='bearing','规格 · 交期')}
        ${navItem('产品询价',pageUrl('quote','bearing','bearing-6205'),route.view==='quote'&&route.site==='bearing','预填 · 提交')}
      </div>
      <div class="sidebar-bottom"><span class="mini-label">测试方式</span><p>在 Chrome 中打开本页，使用 Model Context Tool Inspector 对当前页提问。</p><a href="${demoFileUrl('../README.md')}" target="_blank" rel="noopener">查看测试脚本 ${icon('arrow')}</a><a href="${GOODY_URL}" target="_blank" rel="noopener">顾地真实演示站 ${icon('external')}</a></div>
    </aside>
    <div class="workspace">
      <header class="topbar"><div class="crumb">演示工作台 <span>/</span> ${route.view==='discover'?'模拟搜索':e(site.name)} <span>/</span> <strong>${currentLabel}</strong></div><div class="top-actions"><a class="admin-link" href="${demoFileUrl('admin.html')}" aria-label="打开 WebMCP 后台配置原型">后台配置 ↗</a><span id="tool-badge" class="tool-badge pending" role="status" aria-live="polite"><span class="pulse"></span>检查 WebMCP…</span></div></header>
      <main id="main" tabindex="-1"></main>
    </div>`;
}

const prompts={
  products:[
    '你们有适合市政排水用的 DN315、SN8 双壁波纹管吗？',
    '好，打开这款产品的详情。'
  ],
  detail:[
    '这款产品的公称直径、环刚度和执行标准是什么？',
    '我大概要 1200 米，12 月中旬希望发货。这款产品的交期是多久？',
    '我想询价，顺便请对方确认能否满足发货时间，以及有没有第三方检测报告。'
  ],
  quote:[
    '这款产品要 1200 米，项目在江苏，希望 12 月中旬发货。联系人王宁，手机 13800138000，邮箱 wang.ning@example.com。也请对方确认第三方检测报告。',
    '我已经核对表单，信息无误。请提交这份询价，并告诉我回执编号。'
  ]
};
const bearingPrompts={
  products:[
    '你们有 6205-2RS 深沟球轴承吗？',
    '好，打开它的详情。'
  ],
  detail:[
    '这款轴承的型号、内径、材质和密封形式是什么？',
    '这款产品交期多久？',
    '我想就这款轴承询价。'
  ],
  quote:[
    '我要采购这款轴承 200 件。联系人李工，工作邮箱 ligong@example.com，用于电机，请对方确认批量价格与交货期。',
    '我已经核对表单，信息无误。请提交这份询价，并告诉我回执编号。'
  ]
};
const discoverPrompts=[
  `${DISCOVER_QUERY}帮我搜索合适的供应商官网，比较后告诉我应该先进入哪家，并说明理由。`,
  '进入之前，帮我核实一下你推荐的这家官网：是不是生产厂家，公开信息是否一致？',
  '好，打开这家公司的官网。',
  '换一个需求：我要找市政排水用 HDPE 双壁波纹管 DN315、SN8，大约 1200 米。哪家更合适？'
];
function promptPanel(view){
  const promptList=route.view==='discover'?discoverPrompts:isGoody?goodyPrompts[view]:(route.site==='bearing'&&bearingPrompts[view]?bearingPrompts[view]:prompts[view]);
  const list=promptList.map((p,i)=>`<div class="prompt-item"><span>${String(i+1).padStart(2,'0')}</span><p>${e(p)}</p><button type="button" class="copy-prompt" data-text="${e(p)}" aria-label="复制第 ${i+1} 条提问">复制</button></div>`).join('');
  const intro=route.view==='discover'?'模拟搜索引擎：Agent 用 search_suppliers 比较候选，用 inspect_supplier 核实，用户确认后 open_supplier_site 进入官网。此页工具只属于演示外壳。':isGoody?goodyPromptIntro[view]:{products:'像采购用户一样提问。Agent 找到产品后询问是否打开；您确认后页面自动跳转。',detail:'继续问规格与交期；表达询价意向后，Agent 可打开原表单。',quote:'先让 Agent 预填表单；您核对后可自行点击提交，或明确授权 Agent 调用 submit_quote，页面会再次请您确认。'}[view];
  return `<aside class="prompt-panel" aria-labelledby="prompt-title"><div class="panel-heading"><div><span class="eyebrow">MODEL CONTEXT TOOL INSPECTOR</span><h2 id="prompt-title">本页提问脚本</h2></div>${icon('doc')}</div><p class="panel-intro">${intro}</p>${list}${manualMarkup()}${route.view==='discover'?signalNotes():''}<div class="panel-foot">工具只在当前页面注册。跳转后请在 Inspector 中重新读取当前页工具。</div></aside>`;
}
function manualMarkup(){
  currentManualExamples=manualExamplesForPage({view:route.view,siteKey:route.site,product,form,rows,selectedProductId:selectedSearchProductId});
  if(!currentManualExamples.length)return '';
  const cards=currentManualExamples.map((example,index)=>{
    const json=example.args===null?'':JSON.stringify(example.args,null,2);
    return `<div class="manual-card"><div class="manual-card-head"><code>${e(example.name)}</code>${example.args!==null?`<button type="button" class="copy-args" data-example-index="${index}" aria-label="复制 ${e(example.name)} 的 Input Arguments">复制参数</button>`:''}</div><p>${e(example.purpose)}</p>${example.note?`<p class="manual-unavailable">${e(example.note)}</p>`:''}${example.args!==null?`<pre>${e(json)}</pre>`:''}</div>`;
  }).join('');
  return `<section class="manual-tools" id="manual-examples" aria-labelledby="manual-title"><h3 id="manual-title">手动执行 · Input Arguments</h3><p>在 Inspector 选择对应 Tool，再复制下方 JSON 粘贴到 Input Arguments。<code>example_string</code> 只是插件占位值。</p>${cards}</section>`;
}
function wireManualCopy(){
  document.querySelectorAll('.copy-args').forEach(btn=>btn.addEventListener('click',async()=>{
    const example=currentManualExamples[Number(btn.dataset.exampleIndex)];
    if(!example||example.args===null)return;
    try{await navigator.clipboard.writeText(JSON.stringify(example.args,null,2));btn.textContent='已复制';setTimeout(()=>btn.textContent='复制参数',1500);}
    catch{btn.textContent='请手动复制';}
  }));
}
function refreshManualExamples(){
  const target=$('#manual-examples');if(!target)return;
  target.outerHTML=manualMarkup();wireManualCopy();
}
function wirePromptCopy(){
  document.querySelectorAll('.copy-prompt').forEach(btn=>btn.addEventListener('click',async()=>{
    try {await navigator.clipboard.writeText(btn.dataset.text);btn.textContent='已复制';setTimeout(()=>btn.textContent='复制',1500);}catch{btn.textContent='复制失败';}
  }));
  wireManualCopy();
}

function signalNotes(){
  const rows=goodyIssues.map(x=>`<tr><th scope="row">${e(x.item)}</th><td>${e(x.current)}</td><td>${e(x.fixed)}</td></tr>`).join('');
  return `<details class="signal-notes"><summary>演示说明：顾地发现层信号对照</summary><p>“现状”取自 ${GOODY_SNAPSHOT_DATE} 演示站快照；“一期修正后”是本演示顾地官网采用的内容。按场景需求搜索，现状下顾地排第 4，摘要看不出是管材厂；修正后排第 1。</p><div class="signal-table-wrap"><table class="signal-table"><thead><tr><th>信号</th><th>现状</th><th>一期修正后</th></tr></thead><tbody>${rows}</tbody></table></div></details>`;
}
function serpItem(r){
  const supplier=suppliers.find(x=>x.id===r.siteId);
  const action=supplier.openUrl?`<a class="text-link" href="${e(supplier.openUrl)}">进入官网 ${icon('arrow')}</a>`:'<span class="serp-na">仅搜索结果</span>';
  const chips=[...r.matchedInSnippet.map(t=>`<span class="hit">${e(t)}</span>`),...r.matchedElsewhere.map(t=>`<span class="body-hit" title="只在正文、结构化数据或 llms.txt 中命中">${e(t)}</span>`)].join('');
  return `<article class="serp-item" id="serp-${e(r.siteId)}"><span class="serp-rank">${r.rank}</span><div class="serp-body"><p class="serp-url">${e(r.url)}</p><h3>${e(r.title)}</h3><p class="serp-snippet">${e(r.snippet)}</p><div class="serp-match">${chips}</div></div><div class="serp-action">${action}</div></article>`;
}
function applySupplierSearch(query,result){
  $('#supplier-query').value=query;
  $('#serp-results').innerHTML=result.results.map(serpItem).join('');
  const status=$('#serp-status');
  status.textContent=result.results.length?`${result.results.length} 个候选，按需求与站点摘要的匹配度排序。深色词在标题/描述中命中，浅色词只在正文或结构化数据中命中。`:'没有匹配的候选，请换一种描述。';
}
function highlightSupplier(siteId){
  document.querySelectorAll('.serp-item').forEach(n=>n.classList.toggle('inspected',n.id===`serp-${siteId}`));
  document.getElementById(`serp-${siteId}`)?.scrollIntoView({behavior:'smooth',block:'center'});
}
function renderDiscover(){
  const modeLink=(mode,label)=>`<a href="${discoverUrl(mode)}" class="${metaMode===mode?'active':''}" ${metaMode===mode?'aria-current="true"':''}>${label}</a>`;
  $('#main').innerHTML=`<div class="page-grid"><div class="content-column">
    <div class="intro-band"><span class="eyebrow">01 / DISCOVER</span><h1>从多家公司中找到合适的供应商官网</h1><p>模拟搜索引擎或 Agent 自身的检索：每条结果只有该站公开的标题、网址和描述。进入官网后，公司介绍、产品查询和留资才由该站的 WebMCP 工具完成。</p></div>
    <div class="meta-toggle" role="group" aria-label="顾地官网的发现层信号"><span>顾地官网信号</span>${modeLink('fixed','一期修正后')}${modeLink('current',`现状快照 ${GOODY_SNAPSHOT_DATE}`)}</div>
    <form id="supplier-search" class="supplier-search" role="search"><label for="supplier-query">采购需求</label><div><textarea id="supplier-query" rows="2">${e(DISCOVER_QUERY)}</textarea><button type="submit" class="button button-primary">${icon('search')} 搜索</button></div></form>
    <p id="serp-status" class="serp-status" role="status" aria-live="polite"></p>
    <section id="serp-results" class="serp-list" aria-label="搜索结果"></section>
  </div>${promptPanel('discover')}</div>`;
  $('#supplier-search').addEventListener('submit',ev=>{ev.preventDefault();const q=$('#supplier-query').value;applySupplierSearch(q,searchSuppliers(q,metaMode));});
  applySupplierSearch(DISCOVER_QUERY,searchSuppliers(DISCOVER_QUERY,metaMode));
  wirePromptCopy();
}

function productCard(p){
  return `<article class="product-card"><div class="product-symbol">${route.site==='pipe'?'∿':'◎'}</div><div class="product-copy"><p class="product-kicker">${e(p.category)} · ${e(p.model)}</p><h3>${e(p.name)}</h3><p>${e(p.intro)}</p><div class="chips">${p.tags.map(t=>`<span>${e(t)}</span>`).join('')}</div></div><a href="${pageUrl('detail',route.site,p.id)}" class="text-link">查看详情 ${icon('arrow')}</a></article>`;
}
function renderProducts(){
  const all=publicProducts(route.site);
  $('#main').innerHTML=`<div class="page-grid"><div class="content-column">
    <div class="site-identity"><span class="brand-square">${site.initials}</span><div><span>${e(site.english)}</span><strong>${e(site.name)}</strong></div><small>${e(site.location)}</small></div>
    <div class="page-title"><span class="eyebrow">PRODUCT CATALOG / 产品目录</span><h1>所有产品</h1><p>${e(site.summary)} 可按名称、型号或规格查找适合项目的产品。</p></div>
    <section class="catalog-block" aria-label="产品目录"><div class="section-head"><div><h2>产品列表</h2><p><span id="result-count">${all.length}</span> 款公开产品</p></div><form id="site-search" class="search-box" role="search"><label class="sr-only" for="catalog-keyword">搜索本站产品</label><input id="catalog-keyword" type="search" placeholder="输入名称、型号或规格"><button type="submit" aria-label="搜索">${icon('search')}</button></form></div><p id="catalog-status" class="catalog-status" role="status" aria-live="polite" hidden></p><div id="product-results" class="product-list">${all.map(productCard).join('')}</div><p id="empty-results" class="empty-state" hidden>当前关键词没有匹配的公开产品，请换一个关键词。</p></section>
    <div class="inline-note">${icon('search')} <span>查询后页面会显示匹配产品。用户确认打开时，Agent 可使用当前页的站内导航工具进入详情。</span></div>
  </div>${promptPanel('products')}</div>`;
  $('#site-search').addEventListener('submit',ev=>{ev.preventDefault();const keyword=$('#catalog-keyword').value;applyCatalogSearch(keyword,searchCatalog(route.site,keyword,1,100));});
  wirePromptCopy();
}
function applyCatalogSearch(keyword,result){
  selectedSearchProductId=result.items[0]?.id??null;
  $('#catalog-keyword').value=keyword;
  $('#product-results').innerHTML=result.items.map(productCard).join('');
  $('#result-count').textContent=result.total;
  $('#empty-results').hidden=result.total!==0;
  const status=$('#catalog-status');status.hidden=false;
  status.textContent=result.total?`已找到 ${result.total} 款匹配产品${result.hasMore?'，当前显示部分结果':''}。`:'当前关键词没有匹配的公开产品。';
  refreshManualExamples();
}

function renderDetail(){
  const keys=availableAttrKeys(product);
  const specRows=keys.filter(k=>product.attrs[k].value).map(k=>`<div class="spec-row"><dt>${e(product.attrs[k].label)}</dt><dd>${e(product.attrs[k].value)}${product.attrs[k].unit?` <small>${e(product.attrs[k].unit)}</small>`:''}</dd></div>`).join('');
  $('#main').innerHTML=`<div class="page-grid"><div class="content-column">
    <div class="site-identity"><span class="brand-square">${site.initials}</span><div><span>${e(site.english)}</span><strong>${e(site.name)}</strong></div><small>${e(site.location)}</small></div>
    <nav class="breadcrumb" aria-label="面包屑"><a href="${pageUrl('products')}">所有产品</a>${icon('chevron')}<span>${e(product.category)}</span>${icon('chevron')}<strong>${e(product.name)}</strong></nav>
    <section class="detail-hero"><div class="detail-visual"><span>${route.site==='pipe'?'∿':'◎'}</span><small>${e(product.model)}</small></div><div class="detail-copy"><span class="eyebrow">${e(product.category)} · 产品详情</span><h1>${e(product.name)}</h1><p class="detail-model">型号 ${e(product.model)}</p><p class="detail-intro">${e(product.intro)}</p><div class="detail-highlights">${product.tags.map(t=>`<span>${e(t)}</span>`).join('')}</div><a class="button button-primary button-wide" href="${pageUrl('quote',route.site,product.id)}">询价此产品 ${icon('arrow')}</a><p class="button-hint">进入原询价表单；WebMCP 仅辅助填写。</p></div></section>
    <section class="spec-block"><div class="section-head"><div><span class="eyebrow">CURRENT PRODUCT / 当前产品</span><h2>产品参数</h2></div><span class="section-icon">${icon('layers')}</span></div><dl>${specRows||'<p class="empty-state">当前暂无可展示参数。</p>'}</dl></section>
    <div class="inline-note">${icon('clock')} <span>交货期由当前产品绑定属性提供。查询结果是资料原值，不代表本次数量与目标日期已经确认。</span></div>
  </div>${promptPanel('detail')}</div>`;
  wirePromptCopy();
}

function fieldMarkup(field){
  const required=field.required?' <span class="required">*</span>':'';
  const type=field.type==='integer'?'number':field.format==='email'?'email':field.key==='phone'?'tel':'text';
  const control=field.multiline?`<textarea id="field-${field.key}" name="${field.key}" placeholder="${e(field.placeholder)}" rows="5" ${field.required?'required':''}></textarea>`:`<input id="field-${field.key}" name="${field.key}" type="${type}" placeholder="${e(field.placeholder)}" ${field.minimum!==undefined?`min="${field.minimum}"`:''} ${field.required?'required':''}>`;
  return `<div class="field"><label for="field-${field.key}">${e(field.label)}${required}</label>${control}<p class="field-error" id="error-${field.key}" aria-live="polite"></p></div>`;
}
function lineMarkup(row){
  const options=publicProducts(route.site).map(p=>`<option value="${e(p.id)}" ${p.id===row.productId?'selected':''}>${e(p.name)}</option>`).join('');
  return `<div class="item-row" data-row-ref="${e(row.ref)}"><div class="item-product"><label class="sr-only" for="product-${e(row.ref)}">关联产品</label><select id="product-${e(row.ref)}" class="row-product" data-ref="${e(row.ref)}">${options}</select><small>相关项 · ${e(row.ref)}</small></div>${form.lineFields.map(f=>`<div class="item-input"><label class="sr-only" for="${f.key}-${e(row.ref)}">${e(f.label)}</label><input id="${f.key}-${e(row.ref)}" data-key="${f.key}" type="text" placeholder="${e(f.placeholder)}"></div>`).join('')}<button type="button" class="remove-row" data-ref="${e(row.ref)}" aria-label="移除 ${e(row.ref)}">移除</button></div>`;
}
function quoteHeader(){
  return form.multiItem?`<div class="item-table-head"><span>商品名称</span>${form.lineFields.map(f=>`<span>${e(f.label)}</span>`).join('')}<span>操作</span></div>`:'';
}
function renderQuote(){
  rows=form.multiItem?[{ref:'row_1',productId:product.id}]:[];
  const quoteItem=form.multiItem?`<section class="quote-items"><div class="section-head"><div><span class="eyebrow">SELECTED PRODUCTS</span><h2>询价商品</h2></div><span class="section-icon">${icon('box')}</span></div><div class="item-table">${quoteHeader()}<div id="item-rows">${rows.map(lineMarkup).join('')}</div></div><button type="button" id="add-row" class="subtle-button">＋ 添加一行</button><p class="row-help">商品由原“相关项”控件关联；工具用当前行引用填写数量与期望价格。</p></section>`:`<div class="single-product"><div class="small-symbol">◎</div><div><span>本次询价产品</span><strong>${e(product.name)}</strong><small>${e(product.model)}</small></div></div>`;
  $('#main').innerHTML=`<div class="page-grid"><div class="content-column">
    <div class="site-identity"><span class="brand-square">${site.initials}</span><div><span>${e(site.english)}</span><strong>${e(site.name)}</strong></div><small>${e(site.location)}</small></div>
    <nav class="breadcrumb" aria-label="面包屑"><a href="${pageUrl('products')}">所有产品</a>${icon('chevron')}<a href="${pageUrl('detail',route.site,product.id)}">${e(product.name)}</a>${icon('chevron')}<strong>${e(form.title)}</strong></nav>
    <div class="page-title quote-title"><span class="eyebrow">REQUEST FOR QUOTATION / 询价</span><h1>${e(form.title)}</h1><p>请填写采购需求和联系方式。Agent 可以辅助预填；核对后您可以点击提交，或授权 Agent 提交并取得回执。</p></div>
    <form id="quote-form" novalidate>${quoteItem}<section class="contact-section"><div class="section-head"><div><span class="eyebrow">CONTACT & REQUIREMENTS</span><h2>联系信息与需求</h2></div><span class="section-icon">${icon('doc')}</span></div><div class="field-grid">${form.fields.map(fieldMarkup).join('')}</div></section><div id="form-status" class="form-status" role="status" aria-live="polite" hidden></div><div class="form-actions"><button type="submit" class="button button-primary">提交询价 ${icon('send')}</button><button type="reset" class="button button-secondary">清空填写</button></div></form>
    <div class="inline-note">${icon('check')} <span>演示使用浏览器本地存储模拟原表单回执。<strong>request_quote 只预填</strong>；手动点击提交，或在页面确认 Agent 的 submit_quote 后，才会生成本地演示回执，不会发送给真实企业。</span></div>
  </div>${promptPanel('quote')}</div>`;
  wireQuoteForm();
  if(form.multiItem){
    $('#add-row').addEventListener('click',()=>{
      const next=Math.max(0,...rows.map(r=>Number(r.ref.split('_')[1])))+1;
      const newRow={ref:`row_${next}`,productId:publicProducts(route.site)[0].id};
      rows.push(newRow);$('#item-rows').insertAdjacentHTML('beforeend',lineMarkup(newRow));wireRowEvents();registerTools();
    });
    wireRowEvents();
  }
  wirePromptCopy();
}
function wireQuoteForm(){
  $('#quote-form').addEventListener('submit',submitQuote);
  $('#quote-form').addEventListener('reset',()=>{lastSubmission=null;setTimeout(()=>{const status=$('#form-status');status.hidden=true;clearErrors();document.querySelectorAll('.item-row input').forEach(i=>i.value='');},0);});
}
function wireRowEvents(){
  document.querySelectorAll('.remove-row').forEach(btn=>{
    if(btn.dataset.bound)return;btn.dataset.bound='yes';
    btn.addEventListener('click',()=>{
      if(rows.length===1){setStatus('请至少保留一条商品行。','error');return;}
      rows=rows.filter(r=>r.ref!==btn.dataset.ref);btn.closest('.item-row').remove();registerTools();
    });
  });
  document.querySelectorAll('.row-product').forEach(select=>{
    if(select.dataset.bound)return;select.dataset.bound='yes';
    select.addEventListener('change',()=>{const row=rows.find(r=>r.ref===select.dataset.ref);if(row)row.productId=select.value;registerTools();});
  });
}
function clearErrors(){document.querySelectorAll('.field-error').forEach(node=>node.textContent='');document.querySelectorAll('.field input,.field textarea').forEach(node=>node.removeAttribute('aria-invalid'));}
function setStatus(message,kind='info'){
  const node=$('#form-status');if(!node)return;node.hidden=false;node.className=`form-status ${kind}`;node.textContent=message;
}
function validateForm(){
  clearErrors();const errors={};
  for(const field of form.fields){
    const input=$(`#field-${field.key}`);const value=input.value.trim();
    if(field.required&&!value)errors[field.key]=`请填写${field.label}`;
    else if(value&&field.format==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))errors[field.key]='请输入有效的邮箱地址';
    else if(value&&field.key==='phone'&&!/^[+\d][\d\s-]{6,20}$/.test(value))errors[field.key]='请输入有效的手机号码';
    else if(value&&field.type==='integer'&&(!Number.isInteger(Number(value))||Number(value)<field.minimum))errors[field.key]=`请输入不小于 ${field.minimum} 的整数`;
  }
  for(const [key,message] of Object.entries(errors)){$(`#error-${key}`).textContent=message;$(`#field-${key}`).setAttribute('aria-invalid','true');}
  return errors;
}
function currentInquiryDraft(){
  return {
    site:route.site,formId:form.id,
    productIds:form.multiItem?rows.map(r=>r.productId):form.bindProduct===false?[]:[product.id],
    items:form.multiItem?rows.map(row=>({rowRef:row.ref,productId:row.productId,...Object.fromEntries(form.lineFields.map(field=>[field.key,$(`#${field.key}-${row.ref}`).value]))})):[],
    fields:Object.fromEntries(form.fields.map(field=>[field.key,$(`#field-${field.key}`).value]))
  };
}
function submitCurrentInquiry(){
  const errors=validateForm();
  if(Object.keys(errors).length){setStatus('请按字段提示修正后再提交。','error');$(`#field-${Object.keys(errors)[0]}`).focus();return {status:'validation_error',fieldErrors:errors,message:'尚未提交，请修正页面标出的字段。'};}
  const result=saveDemoInquiry(currentInquiryDraft(),{storage:inquiryStorage,previous:lastSubmission});
  if(result.status==='submitted'){
    lastSubmission=result;
    setStatus(`演示表单已接收，回执 ${result.receipt.id}。这是浏览器本地模拟记录，并未发送给真实企业。`,'success');
    $('#form-status').scrollIntoView({behavior:'smooth',block:'center'});
    return {status:'submitted',receipt:result.receipt,reused:result.reused,message:'已提交并生成浏览器本地演示回执（未发送给真实企业）。请告诉用户已提交、附上回执编号，不要承诺回复时间；可再问用户是否还要了解其他产品或公司信息。'};
  }
  setStatus(result.message,'error');
  return result;
}
function submitQuote(event){
  event.preventDefault();
  submitCurrentInquiry();
}

function toolResult(value){return JSON.stringify(value);}
function readOnlyAnnotations(){return {readOnlyHint:true,consequentialHint:false,untrustedContentHint:true};}
function navigationAnnotations(){return {readOnlyHint:false,consequentialHint:false,untrustedContentHint:true};}
function navigateAfterResult(url){setTimeout(()=>location.assign(url),80);}
function fillCurrentForm(args={}){
  const allKeys=['items',...form.fields.map(f=>f.key)];
  if(Object.keys(args).some(k=>!allKeys.includes(k)))return toolResult({status:'validation_error',message:'输入包含当前表单不存在的字段；请重新读取工具定义。'});
  if(form.multiItem&&args.items!==undefined){
    if(!Array.isArray(args.items))return toolResult({status:'validation_error',message:'items 必须是商品行数组。'});
    for(const item of args.items){
      const row=rows.find(r=>r.ref===item.rowRef);
      if(!row)return toolResult({status:'validation_error',message:'商品行引用已失效；请重新读取本页工具定义。'});
      if(Object.keys(item).some(k=>k!=='rowRef'&&!form.lineFields.some(f=>f.key===k)))return toolResult({status:'validation_error',message:'商品行包含不可填写字段。'});
    }
    for(const item of args.items){for(const f of form.lineFields)if(item[f.key]!==undefined){const input=$(`#${f.key}-${item.rowRef}`);input.value=String(item[f.key]);input.dispatchEvent(new Event('input',{bubbles:true}));}}
  }
  for(const f of form.fields)if(args[f.key]!==undefined){const input=$(`#field-${f.key}`);input.value=String(args[f.key]);input.dispatchEvent(new Event('input',{bubbles:true}));}
  const errors=validateForm();
  $('#quote-form').scrollIntoView({behavior:'smooth',block:'start'});
  if(Object.keys(errors).length){setStatus('已保留本次填写内容，请补齐或修正标出的字段。','error');return toolResult({status:'validation_error',fieldErrors:errors,message:'表单尚未提交；请补齐或修正字段后再核对。'});}
  setStatus('WebMCP 已将信息填写到页面。请核对后自行提交，或确认后让 Agent 提交。','ready');
  const submitName=isGoody?lead.submit:'submit_quote';
  return toolResult({status:'awaiting_user_confirmation',message:`已预填“${form.title}”表单，本次预填没有提交。请用户核对；用户确认后可调用 ${submitName}，也可自行点击提交按钮。`,form:form.title});
}
function submitWithConfirmation(args,submitName){
  if(!args||typeof args!=='object'||Array.isArray(args)||Object.keys(args).length)return toolResult({status:'validation_error',message:`${submitName} 只接收空对象；请先在页面填写并核对。`});
  const errors=validateForm();
  if(Object.keys(errors).length){setStatus('请按字段提示修正后再提交。','error');$(`#field-${Object.keys(errors)[0]}`).focus();return toolResult({status:'validation_error',fieldErrors:errors,message:'尚未提交，请修正页面标出的字段。'});}
  if(lastSubmission?.status==='submitted'&&lastSubmission.signature===JSON.stringify(currentInquiryDraft()))return toolResult(submitCurrentInquiry());
  if(!window.confirm(`请确认提交当前可见的“${form.title}”表单给 ${site.name}？演示环境只会生成浏览器本地回执。`)){
    setStatus('您已取消提交，表单仍可修改。','ready');
    return toolResult({status:'cancelled',message:'用户取消提交，本次未生成记录。'});
  }
  return toolResult(submitCurrentInquiry());
}
function discoverTools(){
  const ids=suppliers.map(x=>x.id);
  return [{
    name:'search_suppliers',description:'模拟搜索引擎：按采购需求搜索候选供应商官网，返回排序后的标题、网址和摘要。结果只是各站公开的发现层信息，尚未核实；请比较后向用户说明推荐理由，可用 inspect_supplier 核实，用户确认后再调用 open_supplier_site。',
    inputSchema:{type:'object',properties:{query:{type:'string',description:'用自然语言描述采购需求，如产品、材质、规格、地区、对供应商的要求。'}},required:['query'],additionalProperties:false},
    annotations:readOnlyAnnotations(),
    execute:async({query=''}={})=>{
      if(!String(query).trim()||String(query).trim()==='example_string')return toolResult({status:'validation_error',message:'请用真实采购需求作为 query，例如“湖北 PVC 给水管 生产厂家”。'});
      const result=searchSuppliers(query,metaMode);
      if(route.view==='discover')applySupplierSearch(query,result);
      return toolResult({status:'ok',query,results:result.results.map(({rank,siteId,title,url,snippet})=>({rank,siteId,title,url,snippet})),message:result.results.length?'这些是搜索摘要，尚未核实。请比较后向用户说明理由；进入前可调用 inspect_supplier 核实。':'没有匹配的候选，请换一种描述。'});
    }
  },{
    name:'inspect_supplier',description:'读取某个候选站点首页公开的发现层信息（title、meta 描述、og、html lang、JSON-LD 组织与 FAQ、llms.txt），用于进入前核实它是否就是要找的公司。只读，不打开网站。',
    inputSchema:{type:'object',properties:{siteId:{type:'string',enum:ids,description:'使用 search_suppliers 返回的 siteId。'}},required:['siteId'],additionalProperties:false},
    annotations:readOnlyAnnotations(),
    execute:async({siteId}={})=>{
      const info=inspectSupplier(siteId,metaMode);
      if(!info)return toolResult({status:'validation_error',message:'未知的 siteId，请先调用 search_suppliers。'});
      if(route.view==='discover')highlightSupplier(siteId);
      return toolResult({status:'ok',...info,message:'以上是该站公开的原始信号，请自行判断是否一致、是否符合用户需求。'});
    }
  },{
    name:'open_supplier_site',description:'用户确认要进入某家候选公司的官网后调用，在当前标签页打开该官网首页。进入后请重新读取新页面的 WebMCP 工具。',
    inputSchema:{type:'object',properties:{siteId:{type:'string',enum:ids,description:'使用 search_suppliers 返回的 siteId。'}},required:['siteId'],additionalProperties:false},
    annotations:navigationAnnotations(),
    execute:async({siteId}={})=>{
      const supplier=suppliers.find(x=>x.id===siteId);
      if(!supplier)return toolResult({status:'validation_error',message:'未知的 siteId，请先调用 search_suppliers。'});
      if(!supplier.openUrl)return toolResult({status:'not_available',siteId,message:'该候选只出现在模拟搜索结果中，没有可进入的演示官网。'});
      navigateAfterResult(new URL(supplier.openUrl,location.href).href);
      return toolResult({status:'opening',siteId,title:signalsFor(supplier,metaMode).title,message:'正在打开官网首页；进入后请重新读取该页工具。'});
    }
  }];
}
function formToolDefinitions({fillName,submitName,fillDescription,submitDescription}){
  return [{
    name:fillName,description:fillDescription,
    inputSchema:quoteSchema(form,rows),annotations:{readOnlyHint:false,consequentialHint:false,untrustedContentHint:true},
    execute:async(args={})=>fillCurrentForm(args)
  },{
    name:submitName,description:submitDescription,
    inputSchema:{type:'object',properties:{},additionalProperties:false},
    annotations:{readOnlyHint:false,consequentialHint:true,untrustedContentHint:true},
    execute:async(args={})=>submitWithConfirmation(args,submitName)
  }];
}
function toolDefinitions(){
  if(route.view==='discover')return discoverTools();
  if(isGoody)return goodyPages.tools();
  if(route.view==='products')return [{
    name:'search_products',description:`根据采购需求查询${site.name}官网已开放的产品，不填关键词时浏览产品。查询结果也会显示在当前页面；找到候选后先介绍产品并询问用户是否打开详情。`,
    inputSchema:{type:'object',properties:{keyword:{type:'string',description:'产品名称、型号或公开规格关键词；不填时浏览本站产品。'},page:{type:'integer',minimum:1,default:1,description:'结果页码，默认第 1 页。'}},additionalProperties:false},
    annotations:readOnlyAnnotations(),
    execute:async({keyword='',page=1}={})=>{
      if(!Number.isInteger(page)||page<1)return toolResult({status:'validation_error',message:'页码必须是正整数。'});
      if(String(keyword).trim()==='example_string')return toolResult({status:'validation_error',message:'example_string 是 Inspector 自动填入的示例占位词。请改用真实产品名称或型号，例如 DN315 SN8。'});
      const result=searchCatalog(route.site,keyword,page);
      applyCatalogSearch(keyword,result);
      return toolResult({status:'ok',site:site.name,keyword,page,hasMore:result.hasMore,products:result.items.map(p=>({id:p.id,name:p.name,model:p.model,summary:p.intro,detailUrl:urlForProduct(p.id)})),message:result.total?'请先向用户介绍匹配产品并询问是否打开；收到确认后可调用 open_product_detail。':'按当前关键词暂未找到公开产品。'});
    }
  },{
    name:'open_product_detail',description:`用户确认要查看某款候选产品后，在${site.name}官网打开该产品详情页。仅用于站内页面跳转，不查询或修改产品资料。`,
    inputSchema:{type:'object',properties:{productId:{type:'string',description:'从 search_products 返回结果中选择产品 id。',enum:publicProducts(route.site).map(p=>p.id)}},required:['productId'],additionalProperties:false},
    annotations:navigationAnnotations(),
    execute:async({productId}={})=>{
      const selected=getProduct(route.site,productId);
      if(!selected)return toolResult({status:'validation_error',message:'这款产品不在当前官网公开候选中，请重新查找。'});
      navigateAfterResult(urlForProduct(selected.id));
      return toolResult({status:'opening',product:selected.name,message:'正在打开当前官网的产品详情页。'});
    }
  }];
  if(route.view==='detail')return [{
    name:'get_product_spec',description:`查询当前页面产品“${product.name}”的已开放规格和采购资料。只读取该产品，不修改数据。`,
    inputSchema:specSchema(product),annotations:readOnlyAnnotations(),
    execute:async({fieldKeys}={})=>{
      const allowed=availableAttrKeys(product);
      if(fieldKeys!==undefined&&(!Array.isArray(fieldKeys)||fieldKeys.some(k=>!allowed.includes(k))))return toolResult({status:'validation_error',message:'fieldKeys 包含当前产品模板不可查询的字段；请重新读取当前页工具定义。'});
      const selected=fieldKeys||allowed;const attributes={};const unavailable=[];
      for(const key of selected){const a=product.attrs[key];if(a?.value!==''&&a?.value!==null&&a?.value!==undefined)attributes[key]={label:a.label,value:a.value,...(a.unit?{unit:a.unit}:{})};else unavailable.push({label:a.label,status:'not_available'});}
      return toolResult({status:Object.keys(attributes).length?'ok':'not_available',product:{id:product.id,name:product.name,model:product.model},attributes,unavailable,message:Object.keys(attributes).length?'仅返回当前产品已开放的实际资料。':'当前没有可提供的规格资料。'});
    }
  },{
    name:'check_lead_time',description:`查询当前页面产品“${product.name}”原属性中的交货期。只返回已有资料，不承诺本次数量或目标日期。`,
    inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:readOnlyAnnotations(),
    execute:async()=>toolResult(product.leadTime.open&&product.leadTime.value?{status:'ok',product:product.name,leadTime:product.leadTime.value,message:'这是当前产品标注的原交货期；实际订单安排需要询价确认。'}:{status:'not_available',product:product.name,message:'这款产品暂未提供可直接查询的交货期，可在询价中请销售确认。'})
  },{
    name:'open_inquiry_form',description:`用户明确表示要就当前产品“${product.name}”询价后，打开${site.name}原有的${form.title}表单。仅打开表单，不填写或提交。`,
    inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:navigationAnnotations(),
    execute:async()=>{
      navigateAfterResult(new URL(pageUrl('quote',route.site,product.id),location.href).href);
      return toolResult({status:'opening',product:product.name,message:'正在打开当前产品的询价表单；表单不会自动提交。'});
    }
  }];
  if(route.view==='quote'&&form.webmcp)return formToolDefinitions({
    fillName:'request_quote',submitName:'submit_quote',
    fillDescription:`填写${site.name}本页“${form.title}”表单，供用户在页面核对；本工具不提交询价。`,
    submitDescription:`用户已核对${site.name}当前“${form.title}”表单并明确要求提交后调用。使用页面当前值，要求用户在浏览器确认，调用原提交处理，并返回实际结果与回执；不要在预填后自动调用。`
  });
  return [];
}
async function registerTools(){
  const serial=++registerSerial;
  refreshManualExamples();
  if(toolController)toolController.abort();
  registered=[];toolController=null;
  const badge=$('#tool-badge');
  const definitions=toolDefinitions();
  if(!definitions.length){badge.className='tool-badge neutral';badge.innerHTML='<span class="badge-dot"></span>本页无 WebMCP 工具';return;}
  if(!document.modelContext?.registerTool){
    const insecureNetworkHttp=location.protocol==='http:'&&!['localhost','127.0.0.1','[::1]'].includes(location.hostname);
    badge.className='tool-badge unsupported';
    badge.innerHTML=`<span class="badge-dot"></span>${insecureNetworkHttp?'需要 HTTPS 才能启用 WebMCP':'WebMCP 未启用'}`;
    badge.title=insecureNetworkHttp?'当前使用非 localhost 的 HTTP 地址。请通过受信任的 HTTPS 地址访问，再检查 Chrome WebMCP 测试开关或 Origin Trial。':'请检查 Chrome WebMCP 测试开关或当前站点的 Origin Trial。';
    return;
  }
  const controller=new AbortController();toolController=controller;
  badge.className='tool-badge pending';badge.innerHTML='<span class="pulse"></span>注册工具中…';
  try{
    for(const def of definitions){await document.modelContext.registerTool(def,{signal:controller.signal});if(serial!==registerSerial)return;registered.push(def.name);}
    badge.className='tool-badge ready';badge.innerHTML=`<span class="badge-dot"></span>${registered.length} WebMCP tool${registered.length===1?'':'s'} ready`;
    badge.title=`当前页已注册：${registered.join('、')}`;
  }catch(error){if(serial!==registerSerial)return;controller.abort();registered=[];badge.className='tool-badge unsupported';badge.innerHTML='<span class="badge-dot"></span>WebMCP 注册失败';badge.title=String(error?.message||error);console.error('WebMCP registerTool failed',error);}
}

const goodyPages=isGoody?createGoodyPages({$,e,icon,route,pageUrl,product,form,lead,promptPanel,wirePromptCopy,fieldMarkup,wireQuoteForm,formToolDefinitions,toolResult,navigateAfterResult,readOnlyAnnotations,navigationAnnotations,setSelectedProduct:id=>{selectedSearchProductId=id;refreshManualExamples();}}):null;
renderShell();
if(route.view==='discover')renderDiscover();
else if(isGoody)goodyPages.render();
else if(route.view==='products')renderProducts();
else if(route.view==='detail')renderDetail();
else if(route.view==='quote')renderQuote();
registerTools();
