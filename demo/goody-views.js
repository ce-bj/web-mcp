import {goodySite,goodyCategories,goodyProducts,goodyCategory,goodyProduct,companyTopics,companyTopicKeys,
  searchGoodyProducts,productSections,productDetailResult,companyInfoResult} from './goody-data.js';

/** 顾地模拟官网的页面类型。所有页面都提供 4 项公共工具；详情页、在线留言页另有表单工具。 */
export const GOODY_VIEWS = ['home', 'company', 'contact', 'products', 'detail', 'message'];
export const GOODY_SITE_PAGES = {home: '官网首页', company: '关于顾地', contact: '联系我们', products: '产品中心', message: '在线留言'};

export const goodyPrompts = {
  home: [
    '先帮我确认：这家公司是做什么的？是生产厂家吗？有哪些资质认证和生产基地？',
    '你们有适合城市供水的 PVC 给水管吗？',
    '好，打开 PVC-U/UH给水管 的详情。',
    '（留资）我们想在湖北做工程供货合作，帮我留个联系方式。'
  ],
  products: [
    '有没有 PVC 给水管？我要用于城市供水，dn110、1.6MPa。',
    '好，打开 PVC-U/UH给水管 的详情。',
    '（留资）没找到合适的，我想留个需求让你们联系我。',
    '（跳到在线留言页后）需要 DN1000 以上的市政排水管约 500 米。联系人王宁，电话 13800138000，邮箱 wang.ning@example.com。'
  ],
  detail: [
    'dn110、1.6MPa 的壁厚是多少？这款产品有什么认证？',
    '这个规格的价格和交期是多少？',
    '帮我留资咨询：dn110、1.6MPa 约 2000 米，项目在湖北武汉，希望 12 月中旬供货，请确认价格、交期并提供检测报告。联系人王宁，电话 13800138000，邮箱 wang.ning@example.com。',
    '我已核对表单，信息无误，请提交并告诉我结果。'
  ],
  company: [
    '你们有哪些生产基地？研发实力和资质怎么样？',
    '售后服务热线和公司地址是什么？',
    '（留资）我想咨询工程合作，帮我留个联系方式。'
  ],
  contact: [
    '售后服务热线和公司地址是什么？',
    '（留资）我想了解经销政策，帮我留个言。'
  ],
  message: [
    '帮我留言：我们是武汉的施工单位，想了解顾地管材的工程项目合作和经销政策。联系人王宁，电话 13800138000，邮箱 wang.ning@example.com。',
    '我已核对，信息无误，请提交。'
  ]
};
export const goodyPromptIntro = {
  home: '进入官网后先确认公司，再查找产品。本页不接入留资表单：用户要留资时，用 open_site_page 跳转到在线留言页再填写。',
  products: '按分类或关键词查找产品；用户确认后再打开详情。本页没有留资表单：用户要留下需求时，用 open_site_page 跳转到在线留言页再填写。',
  detail: '规格从页面规格表回答；价格、交期官网未公开，引导用户在本页“产品咨询”表单留资。request_quote 只预填，submit_quote 还需页面确认。',
  company: '公司介绍、资质与联系方式都由 get_company_info 提供。本页没有留资表单：用户要留资时，用 open_site_page 跳转到在线留言页再填写。',
  contact: '联系方式由 get_company_info 提供。本页没有留资表单：用户要留资时，用 open_site_page 跳转到在线留言页再填写。',
  message: '没有指定产品的合作、经销、售后咨询在此留言。request_message 只预填，submit_message 还需页面确认。'
};

export function createGoodyPages(ctx) {
  const {$, e, icon, route, pageUrl, product, lead, promptPanel, wirePromptCopy, fieldMarkup, form, wireQuoteForm,
    formToolDefinitions, toolResult, navigateAfterResult, readOnlyAnnotations, navigationAnnotations, setSelectedProduct} = ctx;
  const url = (view, extra = '') => `${pageUrl(view, 'goody')}${extra}`;
  const productUrl = id => pageUrl('detail', 'goody', id);
  const absolute = href => new URL(href, location.href).href;

  function header() {
    const nav = [['home', '网站首页'], ['company', '关于顾地'], ['products', '产品中心'], ['contact', '联系我们'], ['message', '在线留言']]
      .map(([view, label]) => `<a href="${url(view)}" class="${route.view === view || (view === 'products' && route.view === 'detail') ? 'active' : ''}">${label}</a>`).join('');
    return `<header class="goody-header"><a class="goody-brand" href="${url('home')}"><span class="goody-logo">顾地</span><span><strong>GOODY 顾地科技</strong><small>塑料管道系统解决方案供应商</small></span></a><nav class="goody-nav" aria-label="顾地官网导航">${nav}</nav><span class="goody-hotline">${icon('clock')} ${goodySite.hotline}</span></header>`;
  }
  function footer() {
    return `<footer class="goody-footer"><span>${e(goodySite.fullName)} · ${e(companyTopics.contact.contact.address)}</span><span>演示页面：内容按顾地演示站模拟，表单只写入浏览器本地。</span></footer>`;
  }
  // 本页的留资方式：有表单用本页工具；没有表单时跳转到在线留言页。
  const leadHint = lead.form
    ? `用本页 ${lead.fill} 留下联系方式`
    : '用 open_site_page（page=message）跳转到“在线留言”页，再在该页用 request_message 留资';
  function frame(body, view) {
    return `<div class="page-grid"><div class="content-column goody-site">${header()}${body}${footer()}</div>${promptPanel(view)}</div>`;
  }
  function productCard(p) {
    const cat = goodyCategory(p.categoryId);
    return `<article class="product-card goody-product"><div class="product-symbol">${e(p.tags[0].slice(0, 5))}</div><div class="product-copy"><p class="product-kicker">${e(cat.name)}${p.source === 'demo' ? ' · 演示资料' : ''}</p><h3>${e(p.name)}</h3><p>${e(p.summary)}</p><div class="chips">${p.tags.map(t => `<span>${e(t)}</span>`).join('')}</div></div><a href="${productUrl(p.id)}" class="text-link">查看详情 ${icon('arrow')}</a></article>`;
  }

  function renderHome() {
    const stats = [['1979', '顾地品牌创建'], ['002694', '深交所上市'], ['5000+', '产品规格'], ['5 大', '生产基地']]
      .map(([n, l]) => `<div><strong>${n}</strong><span>${l}</span></div>`).join('');
    const series = goodyCategories.map(c => `<a class="goody-series" href="${url('products', `&category=${c.id}`)}"><strong>${e(c.name)}</strong><span>${e(c.english)}</span></a>`).join('');
    return frame(`
      <section class="goody-hero"><span class="eyebrow">ABOUT GOODY</span><h1>顾地科技 · 塑料管道系统解决方案供应商</h1><p>${e(companyTopics.profile.text)}</p><div class="goody-actions"><a class="button button-primary" href="${url('products')}">产品中心 ${icon('arrow')}</a><a class="button button-secondary" href="${url('company')}">关于顾地</a></div></section>
      <section class="goody-stats" aria-label="公司概况">${stats}</section>
      <section class="goody-block"><div class="goody-block-head"><h2>产品系列</h2><a class="text-link" href="${url('products')}">全部产品 ${icon('arrow')}</a></div><div class="goody-series-grid">${series}</div></section>
      <section class="goody-block goody-contact-strip"><div><h2>采购咨询</h2><p>选定产品后，在产品详情页“产品咨询”留下需求与联系方式；合作、经销等其他事项请在线留言，或致电 400-105-1979。</p></div><a class="button button-primary" href="${url('message')}">在线留言 ${icon('send')}</a></section>`, 'home');
  }

  function renderCompany() {
    const t = companyTopics;
    const list = items => `<ul class="goody-list">${items.map(x => `<li>${e(x)}</li>`).join('')}</ul>`;
    return frame(`
      <div class="page-title"><span class="eyebrow">ABOUT GOODY / 关于顾地</span><h1>关于顾地</h1><p>${e(t.profile.text)}</p></div>
      <div class="goody-about-grid">
        <section class="goody-block"><h2>${t.brands.title}</h2><p>${e(t.brands.text)}</p></section>
        <section class="goody-block"><h2>${t.organization.title}</h2><p>${e(t.organization.text)}</p></section>
        <section class="goody-block"><h2>${t.history.title}</h2>${list(t.history.items)}</section>
        <section class="goody-block"><h2>${t.strength.title}</h2><p>${e(t.strength.text)}</p></section>
        <section class="goody-block"><h2>${t.honors.title}</h2><div class="chips goody-chips">${t.honors.items.map(x => `<span>${e(x)}</span>`).join('')}</div></section>
        <section class="goody-block"><h2>${t.culture.title}</h2><p>${e(t.culture.text)}</p></section>
      </div>`, 'company');
  }

  function renderContact() {
    const c = companyTopics.contact.contact;
    const rows = [['售后服务热线', c.serviceHotline], ['公司电话', c.telephone], ['传真', c.fax], ['公司地址', c.address]]
      .map(([k, v]) => `<div class="spec-row"><dt>${k}</dt><dd>${e(v)}</dd></div>`).join('');
    return frame(`
      <div class="page-title"><span class="eyebrow">CONTACT US / 联系我们</span><h1>联系我们</h1><p>${e(c.productInquiry)}</p></div>
      <section class="spec-block"><div class="section-head"><div><span class="eyebrow">CONTACT</span><h2>联系方式</h2></div></div><dl>${rows}</dl></section>
      <div class="inline-note">${icon('send')} <span>没有指定产品的合作、经销或售后事项，请前往 <a class="text-link inline" href="${url('message')}">在线留言</a>。</span></div>`, 'contact');
  }

  function renderProducts() {
    const current = goodyCategory(route.category);
    const tabs = [`<a href="${url('products')}" class="${current ? '' : 'active'}">全部</a>`, ...goodyCategories.map(c => `<a href="${url('products', `&category=${c.id}`)}" class="${current?.id === c.id ? 'active' : ''}">${e(c.name)}</a>`)].join('');
    const result = searchGoodyProducts({categoryId: current?.id, page: 1});
    return frame(`
      <div class="page-title"><span class="eyebrow">PRODUCTS / 产品中心</span><h1>${current ? e(current.name) : '产品中心'}</h1><p>PVC / PE / PP 三大系列 10 余个品类。按分类浏览，或输入产品名称、材质、用途查找。</p></div>
      <nav class="goody-tabs" aria-label="产品分类">${tabs}</nav>
      <section class="catalog-block" aria-label="产品列表"><div class="section-head"><div><h2>产品列表</h2><p><span id="result-count">${result.total}</span> 款产品</p></div><form id="site-search" class="search-box" role="search"><label class="sr-only" for="catalog-keyword">搜索产品</label><input id="catalog-keyword" type="search" placeholder="如：PVC 给水管"><button type="submit" aria-label="搜索">${icon('search')}</button></form></div><p id="catalog-status" class="catalog-status" role="status" aria-live="polite" hidden></p><div id="product-results" class="product-list">${result.items.map(productCard).join('')}</div><p id="empty-results" class="empty-state" ${result.total ? 'hidden' : ''}>没有匹配的产品，请换一个关键词或分类。</p></section>`, 'products');
  }
  function showSearch(keyword, categoryId, result) {
    if (route.view !== 'products' || !$('#product-results')) return;
    $('#catalog-keyword').value = keyword;
    $('#product-results').innerHTML = result.items.map(productCard).join('');
    $('#result-count').textContent = result.total;
    $('#empty-results').hidden = result.total !== 0;
    const status = $('#catalog-status'); status.hidden = false;
    const scope = categoryId ? `“${goodyCategory(categoryId).name}”中` : '';
    status.textContent = result.total ? `${scope}找到 ${result.total} 款产品${result.hasMore ? '，当前显示第一页' : ''}。` : `${scope}没有匹配的产品。`;
  }

  function renderDetail() {
    const p = product, cat = goodyCategory(p.categoryId);
    const params = p.params.map(x => `<div class="spec-row"><dt>${e(x.label)}</dt><dd>${e(x.value)}</dd></div>`).join('');
    const tables = p.specTables.map(t => `<section class="goody-block"><h2>${e(t.title)}</h2><p class="goody-table-note">行：${e(t.rowHeader)}；列：${e(t.columnHeader)}；单元格：${e(t.cellMeaning)}。${e(t.note)}</p><div class="goody-table-wrap"><table class="goody-table"><thead><tr><th scope="col">dn \\ MPa</th>${t.columns.map(c => `<th scope="col">${e(c)}</th>`).join('')}</tr></thead><tbody>${t.rows.map(r => `<tr><th scope="row">${e(r.dn)}</th>${r.values.map(v => `<td>${e(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></section>`).join('');
    return frame(`
      <nav class="breadcrumb" aria-label="面包屑"><a href="${url('products')}">产品中心</a>${icon('chevron')}<a href="${url('products', `&category=${cat.id}`)}">${e(cat.name)}</a>${icon('chevron')}<strong>${e(p.name)}</strong></nav>
      <section class="detail-hero"><div class="detail-visual"><span class="goody-visual">${e(p.tags[0])}</span><small>${e(cat.english.toUpperCase())}</small></div><div class="detail-copy"><span class="eyebrow">所属分类：${e(cat.name)}</span><h1>${e(p.name)}</h1><p class="detail-intro">概要：${e(p.summary)}</p><dl class="goody-params">${params}</dl><a class="button button-primary button-wide" href="#product-inquiry">产品留言咨询 ${icon('arrow')}</a><p class="button-hint">${p.source === 'demo' ? '演示资料，不代表真实产品参数。' : '内容取自演示站产品页。'}价格、交期请通过产品咨询确认。</p></div></section>
      <section class="goody-block"><h2>产品简介</h2>${p.intro.map(x => `<p>${e(x)}</p>`).join('')}</section>
      <div class="goody-about-grid"><section class="goody-block"><h2>产品特点</h2><ul class="goody-list">${p.features.map(x => `<li>${e(x)}</li>`).join('')}</ul></section><section class="goody-block"><h2>应用领域</h2><ul class="goody-list">${p.applications.map(x => `<li>${e(x)}</li>`).join('')}</ul>${p.certifications.length ? `<h2 class="goody-sub">认证</h2><div class="chips goody-chips">${p.certifications.map(x => `<span>${e(x)}</span>`).join('')}</div>` : ''}</section></div>
      ${tables}
      ${formSection('product-inquiry', '产品咨询', `<div class="single-product"><div class="small-symbol">${icon('box')}</div><div><span>咨询产品（相关项，已自动关联）</span><strong>${e(p.name)}</strong><small>${e(cat.name)}</small></div></div>`)}`, 'detail');
  }

  function formSection(anchor, title, context = '', intro = '带 * 为必填。Agent 可辅助预填；核对后您可以点击提交，或授权 Agent 提交并在页面确认。') {
    const eyebrow = anchor === 'product-inquiry' ? 'PRODUCT INQUIRY' : 'ONLINE MESSAGE';
    return `<section id="${anchor}" class="goody-form-section"><div class="page-title quote-title"><span class="eyebrow">${eyebrow}</span><h2>${e(title)}</h2><p>${e(intro)}</p></div>
      <form id="quote-form" novalidate>${context}<section class="contact-section"><div class="field-grid">${form.fields.map(fieldMarkup).join('')}</div></section><div id="form-status" class="form-status" role="status" aria-live="polite" hidden></div><div class="form-actions"><button type="submit" class="button button-primary">立即提交 ${icon('send')}</button><button type="reset" class="button button-secondary">清空填写</button></div></form></section>`;
  }

  function renderMessage() {
    return frame(`
      <div class="page-title"><span class="eyebrow">ONLINE MESSAGE / 在线留言</span><h1>在线留言</h1><p>合作、经销、工程项目或售后事项，请留下联系方式，我们会安排专人回复。</p></div>
      ${formSection('online-message', '留言信息')}`, 'message');
  }

  function render() {
    const html = {home: renderHome, company: renderCompany, contact: renderContact, products: renderProducts, detail: renderDetail, message: renderMessage}[route.view]();
    $('#main').innerHTML = html;
    if (route.view === 'products') {
      $('#site-search').addEventListener('submit', ev => {
        ev.preventDefault();
        const keyword = $('#catalog-keyword').value;
        showSearch(keyword, route.category || undefined, searchGoodyProducts({keyword, categoryId: route.category || undefined, page: 1}));
      });
    }
    if (lead.form) wireQuoteForm();
    wirePromptCopy();
  }

  const categoryEnum = goodyCategories.map(c => c.id);
  function globalTools() {
    return [{
      name: 'get_company_info',
      description: `查询顾地科技官网公开的公司信息：简介、品牌、历史、生产基地与营销网络、研发实力、资质荣誉、品牌文化、联系方式。用于在咨询前确认公司身份与实力。回答后可引导用户下一步：查找产品（search_products），或有采购、合作意向时${leadHint}。`,
      inputSchema: {type: 'object', properties: {topics: {type: 'array', description: `要查询的主题，不传时返回全部：${companyTopicKeys.map(k => `${k}=${companyTopics[k].title}`).join('；')}。`, items: {type: 'string', enum: companyTopicKeys}, minItems: 1, uniqueItems: true}}, additionalProperties: false},
      annotations: readOnlyAnnotations(),
      execute: async ({topics} = {}) => {
        if (topics !== undefined && (!Array.isArray(topics) || !topics.length || topics.some(t => !companyTopicKeys.includes(t)))) return toolResult({status: 'validation_error', message: `topics 只能取 ${companyTopicKeys.join('、')}。`});
        return toolResult({...companyInfoResult(topics || companyTopicKeys), message: `回答后可询问用户是否要查找产品（search_products）；用户有采购、合作或代理意向时，${leadHint}。`});
      }
    }, {
      name: 'search_products',
      description: `查找顾地科技官网公开的产品，可按关键词（名称、材质、用途）和产品分类筛选，分页返回产品名称、分类、概要和详情链接。规格参数（如 dn、压力）不参与检索，请先找到产品再查看详情。找到候选后先向用户介绍，用户确认后再调用 open_product_detail；找不到合适产品时，可询问用户是否留下需求，由企业跟进：${leadHint}。`,
      inputSchema: {type: 'object', properties: {
        keyword: {type: 'string', description: '关键词，如“PVC 给水管”“燃气”；不填时浏览。'},
        categoryId: {type: 'string', enum: categoryEnum, description: `产品分类：${goodyCategories.map(c => `${c.id}=${c.name}`).join('；')}。`},
        page: {type: 'integer', minimum: 1, default: 1, description: '页码，默认第 1 页。'}
      }, additionalProperties: false},
      annotations: readOnlyAnnotations(),
      execute: async ({keyword = '', categoryId, page = 1} = {}) => {
        if (String(keyword).trim() === 'example_string') return toolResult({status: 'validation_error', message: 'example_string 是 Inspector 的示例占位词，请改用真实关键词，例如“PVC 给水管”。'});
        if (categoryId !== undefined && !categoryEnum.includes(categoryId)) return toolResult({status: 'validation_error', message: '未知的产品分类。'});
        if (!Number.isInteger(page) || page < 1) return toolResult({status: 'validation_error', message: '页码必须是正整数。'});
        const result = searchGoodyProducts({keyword, categoryId, page});
        showSearch(keyword, categoryId, result);
        setSelectedProduct(result.items[0]?.id ?? null);
        return toolResult({status: 'ok', keyword, category: categoryId ? goodyCategory(categoryId).name : '全部', page, hasMore: result.hasMore, total: result.total,
          products: result.items.map(p => ({productId: p.id, name: p.name, category: goodyCategory(p.categoryId).name, summary: p.summary, detailUrl: absolute(productUrl(p.id))})),
          message: result.total ? '请先向用户介绍候选产品并询问是否打开详情；用户确认后调用 open_product_detail。' : `按当前条件暂未找到产品。可建议换关键词或浏览分类；也可询问用户是否留下需求，由企业跟进：${leadHint}。`});
      }
    }, {
      name: 'open_product_detail',
      description: '用户确认要查看某款产品后，打开顾地官网该产品的详情页。仅站内跳转，不查询或修改资料。',
      inputSchema: {type: 'object', properties: {productId: {type: 'string', enum: goodyProducts.map(p => p.id), description: '使用 search_products 返回的 productId。'}}, required: ['productId'], additionalProperties: false},
      annotations: navigationAnnotations(),
      execute: async ({productId} = {}) => {
        const p = goodyProduct(productId);
        if (!p) return toolResult({status: 'validation_error', message: '该产品不在官网公开产品中，请重新查找。'});
        navigateAfterResult(absolute(productUrl(p.id)));
        return toolResult({status: 'opening', product: p.name, message: '正在打开产品详情页；打开后请重新读取该页工具。'});
      }
    }, {
      name: 'open_site_page',
      description: `用户要求时打开顾地官网的固定页面：home=官网首页，company=关于顾地，contact=联系我们，products=产品中心，message=在线留言（采购需求、合作、经销、售后留言）。${lead.form ? '' : '本页没有留资表单，用户要留下联系方式时，征得同意后打开 message，再在该页用 request_message 填写。'}`,
      inputSchema: {type: 'object', properties: {page: {type: 'string', enum: Object.keys(GOODY_SITE_PAGES), description: Object.entries(GOODY_SITE_PAGES).map(([k, v]) => `${k}=${v}`).join('；')}}, required: ['page'], additionalProperties: false},
      annotations: navigationAnnotations(),
      execute: async ({page} = {}) => {
        if (!GOODY_SITE_PAGES[page]) return toolResult({status: 'validation_error', message: '未知页面。'});
        navigateAfterResult(absolute(url(page)));
        return toolResult({status: 'opening', page: GOODY_SITE_PAGES[page], message: page === 'message' ? '正在打开在线留言页；打开后请重新读取该页工具，用 request_message 填写用户已提供的信息，缺少电话或邮箱时先询问。' : '正在打开页面；打开后请重新读取该页工具。'});
      }
    }];
  }

  function detailTools() {
    return [{
      name: 'get_product_detail',
      description: `读取当前页面产品“${product.name}”的公开资料：概要、简介、特点、应用领域、参数、规格表和认证。规格表按行（公称外径）与列（公称压力）原样返回，请据此查表回答，不要推算表中没有的组合。价格、交货期、库存不在官网公开；用户问到这些或表示要询价时，引导用户用 request_quote 在本页留资。`,
      inputSchema: {type: 'object', properties: {sections: {type: 'array', description: `只返回指定部分，不传时返回全部：overview=简介，features=特点，applications=应用领域，params=参数，specTables=规格表，certifications=认证。`, items: {type: 'string', enum: productSections}, minItems: 1, uniqueItems: true}}, additionalProperties: false},
      annotations: readOnlyAnnotations(),
      execute: async ({sections} = {}) => {
        if (sections !== undefined && (!Array.isArray(sections) || !sections.length || sections.some(s => !productSections.includes(s)))) return toolResult({status: 'validation_error', message: `sections 只能取 ${productSections.join('、')}。`});
        return toolResult(productDetailResult(product, sections || productSections));
      }
    }, ...formToolDefinitions({
      fillName: 'request_quote', submitName: 'submit_quote',
      fillDescription: `用户明确要咨询或询价时，填写本页“产品咨询”表单（咨询产品已自动关联为“${product.name}”），供用户在页面核对；本工具不提交。规格、数量、项目地点、价格交期等待确认问题写入 inquiryContent。电话、邮箱等必填信息用户没给时先询问，不要编造。`,
      submitDescription: '用户核对本页“产品咨询”表单并明确要求提交后调用。使用页面当前值，先在页面请求用户确认，再走原提交处理并返回实际结果；不得在预填后自动调用。'
    })];
  }
  function messageTools() {
    const where = '本页“在线留言”表单';
    const common = '要就某款产品询价时，先打开该产品详情页使用 request_quote。电话、邮箱等必填信息用户没给时先询问，不要编造。';
    return formToolDefinitions({
      fillName: lead.fill, submitName: lead.submit,
      fillDescription: `用户有采购需求、合作、代理经销、工程项目或售后等事项要留下联系方式时，填写${where}，供用户核对；本工具不提交。${common}`,
      submitDescription: `用户核对${where}并明确要求提交后调用。先在页面请求用户确认，再走原提交处理并返回实际结果；不得在预填后自动调用。`
    });
  }

  function tools() {
    return [...globalTools(), ...(route.view === 'detail' ? detailTools() : lead.form ? messageTools() : [])];
  }

  return {render, tools};
}
