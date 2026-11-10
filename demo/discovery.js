/**
 * 模拟“发现与选择”阶段：Agent 在多家公司中找到合适的供应商官网。
 *
 * 这一层不属于中台 WebMCP 需求，只用于演示：搜索引擎或 Agent 自身检索看到的是各站点的
 * 标题、描述、结构化数据和 llms.txt。顾地的“现状”信号来自演示站真实快照，不手写美化；
 * “修正后”信号是一期要求演示站完成的发现层修正，也是本仓库顾地模拟官网采用的内容。
 * 其余候选均为虚构公司；kind 为 listing 的候选只出现在搜索结果中，没有可进入的官网。
 */

export const GOODY_SNAPSHOT_DATE = '2026-11-10';
export const GOODY_URL = 'https://endemo.xuoumaill.cn/';
export const GOODY_PRODUCT_URL = 'https://endemo.xuoumaill.cn/product_detail/51.html';

const goodyCurrent = {
  url: GOODY_URL,
  title: 'Magnetic building blocks',
  description: 'http://www.wintom.cn/ 零售TOC，对个人有翅膀可以飞的',
  keywords: 'newborn diapers,baby diapers,best diapers,相机镜头供应商',
  ogTitle: '优质相机镜头供应商',
  ogSiteName: 'http://www.wintom.cn/',
  lang: 'en',
  h1: 'goody 顾地',
  organizations: [
    {name: 'http://www.wintom.cn/', url: GOODY_URL},
    {name: '顾地科技股份有限公司', url: 'https://www.goody.com.cn/', telephone: '+86-400-105-1979'}
  ],
  faq: [
    {q: '顾地科技的主营产品有哪些？', a: '顾地科技（股票代码002694）主营 PVC、PE、PP 管材管件，覆盖市政给排水、建筑家装、农业灌溉、电力通讯等管网系统。'}
  ],
  llms: {
    title: 'Magnetic building blocks',
    summary: 'Goody Technology Co., Ltd. is a listed Chinese plastic pipe manufacturer, founded in 1999 and headquartered in Ezhou, Hubei, producing PVC, PE, and PP pipes and fittings across mor',
    notes: ['关于顾地：Overview of Goody company, including its retail business targeting individual consumers.', '环保给水管系列：Environmentally friendly water supply pipe series.']
  }
};

const goodyFixed = {
  url: GOODY_URL,
  title: '顾地科技｜PVC-U 给水管、排水管等塑料管道系统生产厂家',
  description: '顾地科技（股票代码 002694）始创于 1979 年，总部位于湖北鄂州，在湖北、重庆、佛山、甘肃、北京设有生产基地，生产 PVC-U 环保给水管、排水排污管、电力通讯管、燃气管等 10 余个品类；PVC-U/UH 给水管通过中国环境标志产品认证。',
  keywords: 'PVC给水管,PVC-U给水管,塑料管道,市政给排水,顾地科技',
  ogTitle: '顾地科技｜塑料管道系统生产厂家',
  ogSiteName: '顾地科技',
  lang: 'zh-CN',
  h1: '顾地科技 · 塑料管道系统解决方案供应商',
  organizations: [
    {name: '顾地科技股份有限公司', url: GOODY_URL, telephone: '+86-400-105-1979', address: '湖北省鄂州市经济开发区吴楚大道18号', description: '上市塑料管道生产厂家，PVC/PE/PP 管材管件。'}
  ],
  faq: goodyCurrent.faq,
  llms: {
    title: '顾地科技 Goody Technology',
    summary: 'Goody Technology Co., Ltd. (SZ 002694) is a listed plastic pipe manufacturer headquartered in Ezhou, Hubei, with production bases in Hubei, Chongqing, Foshan, Gansu and Beijing, producing PVC, PE and PP pipes and fittings, including PVC-U water supply pipes certified with the China Environmental Labelling.',
    notes: ['环保给水管系列：PVC-U/UH 给水管等，含规格表。']
  }
};

/** 演示用候选公司。goody 与 mock 可进入本仓库的模拟官网（openUrl）；listing 仅作为搜索结果出现。 */
export const suppliers = [
  {id: 'goody', kind: 'goody', openUrl: './index.html?view=home&site=goody', signals: {current: goodyCurrent, fixed: goodyFixed}},
  {
    id: 'etong', kind: 'listing',
    signals: {
      url: 'https://etong-pipe.example/', title: '鄂通管材商贸｜武汉 PVC 给水管、PPR 管经销',
      description: '武汉本地管材经销商，代理多个品牌的 PVC 给水管、PPR 管和管件，现货批发，可配送湖北各地工地。',
      keywords: 'PVC给水管,PPR管,武汉管材批发', lang: 'zh-CN', h1: '鄂通管材商贸',
      organizations: [{name: '武汉鄂通管材商贸有限公司（虚构）', url: 'https://etong-pipe.example/', description: '管材经销与配送，不从事生产。'}],
      faq: [], llms: null
    }
  },
  {
    id: 'linjiang', kind: 'listing',
    signals: {
      url: 'https://linjiang-pe.example/', title: '临江塑业｜PE100 给水管生产厂家',
      description: '安徽 PE 给水管生产厂家，主营 PE100 给水管、PE 管件，产品取得涉水产品卫生许可批件，服务市政供水工程。',
      keywords: 'PE给水管,PE100,市政供水', lang: 'zh-CN', h1: '临江塑业',
      organizations: [{name: '安徽临江塑业有限公司（虚构）', url: 'https://linjiang-pe.example/', address: '安徽芜湖'}],
      faq: [], llms: null
    }
  },
  {
    id: 'zhongyuan', kind: 'listing',
    signals: {
      url: 'https://zy-ductile.example/', title: '中原球墨铸管｜球墨铸铁给水管生产厂家',
      description: '河南球墨铸铁管生产厂家，产品用于城市供水、输水干线，通过 ISO 9001 认证。',
      keywords: '球墨铸铁管,给水管,城市供水', lang: 'zh-CN', h1: '中原球墨铸管',
      organizations: [{name: '中原球墨铸管有限公司（虚构）', url: 'https://zy-ductile.example/', address: '河南新乡'}],
      faq: [], llms: null
    }
  },
  {
    id: 'pipe', kind: 'mock', openUrl: './index.html?view=products&site=pipe',
    signals: {
      url: 'https://chengchuan-pipe.example/', title: '澄川管业｜HDPE 双壁波纹管、市政排水管网',
      description: '面向市政排水、道路与园区管网项目，提供 HDPE 双壁波纹管及配套管件。江苏常州。',
      keywords: '双壁波纹管,HDPE,市政排水', lang: 'zh-CN', h1: '澄川管业',
      organizations: [{name: '澄川管业（模拟官网）', url: 'https://chengchuan-pipe.example/', address: '江苏常州'}],
      faq: [], llms: null
    }
  },
  {
    id: 'mingjing', kind: 'listing',
    signals: {
      url: 'https://mingjing-optics.example/', title: '明镜光学｜优质相机镜头供应商',
      description: '相机镜头、工业镜头 OEM 供应商，支持定制镀膜与小批量打样。',
      keywords: '相机镜头供应商,工业镜头', lang: 'zh-CN', h1: '明镜光学',
      organizations: [{name: '明镜光学有限公司（虚构）', url: 'https://mingjing-optics.example/'}],
      faq: [], llms: null
    }
  },
  {
    id: 'bearing', kind: 'mock', openUrl: './index.html?view=products&site=bearing',
    signals: {
      url: 'https://hengxing-bearing.example/', title: '衡星精密｜深沟球轴承、工业传动轴承',
      description: '提供电机、输送设备与通用机械用轴承及选型支持。浙江宁波。',
      keywords: '轴承,深沟球轴承', lang: 'zh-CN', h1: '衡星精密',
      organizations: [{name: '衡星精密（模拟官网）', url: 'https://hengxing-bearing.example/', address: '浙江宁波'}],
      faq: [], llms: null
    }
  }
];

/** 搜索词典：同一组内的写法视为同义，中英文都覆盖，便于命中 llms.txt 等英文内容。 */
export const LEXICON = [
  {term: '湖北', aliases: ['湖北', '武汉', '鄂州', 'hubei', 'ezhou', 'wuhan']},
  {term: '给水', aliases: ['给水', '供水', '给排水', '输水', 'water supply']},
  {term: '排水', aliases: ['排水', '排污', '给排水', 'drainage', 'sewage']},
  {term: 'PVC', aliases: ['pvc']},
  {term: 'PE', aliases: ['pe', 'pe100']},
  {term: '管材', aliases: ['管材', '给水管', '排水管', '管道', '管件', 'pipe', 'pipes']},
  {term: '生产厂家', aliases: ['生产厂家', '厂家', '制造商', '生产基地', 'manufacturer']},
  {term: '认证', aliases: ['认证', '环境标志', '卫生许可', '涉水', '卫生', 'certified', 'certification']},
  {term: '球墨铸铁', aliases: ['球墨铸铁', '铸铁', 'ductile']},
  {term: '双壁波纹管', aliases: ['双壁波纹管', '波纹管']},
  {term: '经销', aliases: ['经销', '代理', '批发', 'distributor']},
  {term: '轴承', aliases: ['轴承', 'bearing']},
  {term: '镜头', aliases: ['镜头', 'lens']}
];

export function signalsFor(supplier, metaMode = 'fixed') {
  return supplier.kind === 'goody' ? supplier.signals[metaMode === 'current' ? 'current' : 'fixed'] : supplier.signals;
}

// 英文写法按单词边界匹配，避免 “pipe” 被当成 “PE”；中文写法按子串匹配。
const aliasMatchers = new Map(LEXICON.flatMap(group => group.aliases).map(alias => [alias,
  /^[a-z0-9 ]+$/.test(alias) ? new RegExp(`(?<![a-z])${alias}(?![a-z])`) : null]));
function hasAlias(lower, alias) {
  const re = aliasMatchers.get(alias);
  return re ? re.test(lower) : lower.includes(alias);
}
function termsIn(text) {
  const lower = String(text || '').toLowerCase();
  return LEXICON.filter(group => group.aliases.some(alias => hasAlias(lower, alias))).map(group => group.term);
}

function headlineText(s) {return [s.title, s.description].join(' ');}
function bodyText(s) {
  return [s.keywords, s.ogTitle, s.ogSiteName, s.h1,
    ...s.organizations.flatMap(o => [o.name, o.description, o.address]),
    ...s.faq.flatMap(f => [f.q, f.a]),
    s.llms?.title, s.llms?.summary, ...(s.llms?.notes || [])].join(' ');
}

/**
 * 模拟搜索：标题和描述中的命中计 2 分（相当于搜索摘要），只在正文、结构化数据或 llms.txt 中命中计 1 分。
 * 只返回至少命中一项需求的候选，按分数降序；同分保持候选原顺序。
 */
export function searchSuppliers(query, metaMode = 'fixed') {
  const wanted = termsIn(query);
  const results = suppliers.map((supplier, order) => {
    const s = signalsFor(supplier, metaMode);
    const headline = termsIn(headlineText(s));
    const body = termsIn(bodyText(s));
    const matchedInSnippet = wanted.filter(t => headline.includes(t));
    const matchedElsewhere = wanted.filter(t => !headline.includes(t) && body.includes(t));
    return {supplier, order, s, matchedInSnippet, matchedElsewhere, score: matchedInSnippet.length * 2 + matchedElsewhere.length};
  }).filter(r => r.score > 0).sort((a, b) => b.score - a.score || a.order - b.order);
  return {
    queryTerms: wanted,
    results: results.map((r, index) => ({
      rank: index + 1, siteId: r.supplier.id, title: r.s.title, url: r.s.url, snippet: r.s.description,
      matchedInSnippet: r.matchedInSnippet, matchedElsewhere: r.matchedElsewhere
    }))
  };
}

/** 模拟 Agent 打开候选首页时能读到的发现层信号；不加任何“对错”判断，交给 Agent 自行理解。 */
export function inspectSupplier(siteId, metaMode = 'fixed') {
  const supplier = suppliers.find(x => x.id === siteId);
  if (!supplier) return null;
  const s = signalsFor(supplier, metaMode);
  return {
    siteId, url: s.url, lang: s.lang, title: s.title, metaDescription: s.description, metaKeywords: s.keywords,
    ogTitle: s.ogTitle || s.title, ogSiteName: s.ogSiteName || s.h1, h1: s.h1,
    structuredData: {organizations: s.organizations, faq: s.faq},
    llmsTxt: s.llms || 'not_found'
  };
}

/** 演示说明用：顾地现状信号中可被 Agent 读到的矛盾点。只在页面说明区展示，不进入工具结果。 */
export const goodyIssues = [
  {item: '<title>', current: goodyCurrent.title, fixed: goodyFixed.title},
  {item: 'meta description', current: goodyCurrent.description, fixed: goodyFixed.description},
  {item: 'meta keywords', current: goodyCurrent.keywords, fixed: goodyFixed.keywords},
  {item: 'og:title / og:site_name', current: `${goodyCurrent.ogTitle} / ${goodyCurrent.ogSiteName}`, fixed: `${goodyFixed.ogTitle} / ${goodyFixed.ogSiteName}`},
  {item: 'html lang', current: goodyCurrent.lang, fixed: goodyFixed.lang},
  {item: 'JSON-LD Organization', current: '两个：http://www.wintom.cn/ 与 顾地科技（url 指向 goody.com.cn）', fixed: '一个：顾地科技，url 为本站，带地址和简介'},
  {item: 'llms.txt', current: '标题 Magnetic building blocks；简介被截断；“关于顾地”写成面向个人的零售业务', fixed: '标题顾地科技；完整简介含生产基地与给水管认证'}
];
