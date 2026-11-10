/**
 * 顾地科技模拟官网数据（一期固定演示）。
 *
 * 模拟的是“完成发现层修正、上线一期 WebMCP 后”的演示站 https://endemo.xuoumaill.cn/。
 * 公司介绍、PVC-U/UH 给水管的介绍与规格表取自演示站公开页面；其余产品为演示用资料（source: 'demo'），
 * 只用于走通流程，不代表顾地真实产品参数。价格、交期刻意不提供，用于演示“查不到 → 留资咨询”。
 */

export const goodySite = {
  name: '顾地科技', fullName: '顾地科技股份有限公司', english: 'GOODY TECHNOLOGY',
  initials: 'GD', hotline: '400-105-1979', realUrl: 'https://endemo.xuoumaill.cn/'
};

export const goodyCategories = [
  {id: 'water', name: '环保给水管系列', english: 'Water supply pipe', realPath: '/products_list_1/3.html'},
  {id: 'drainage', name: '排水排污管系列', english: 'Drainage and sewage pipe', realPath: '/products_list_1/4.html'},
  {id: 'power', name: '电力通讯管系列', english: 'Power & communication pipe', realPath: '/products_list_1/6.html'},
  {id: 'irrigation', name: '农用灌溉管系列', english: 'Agricultural irrigation pipe', realPath: '/products_list_1/7.html'},
  {id: 'aquaculture', name: '渔业养殖管系列', english: 'Aquaculture pipe', realPath: '/products_list_1/8.html'},
  {id: 'gas', name: '燃气输送管系列', english: 'Gas transmission pipe', realPath: '/products_list_1/10.html'},
  {id: 'heating', name: '采暖管系列', english: 'Heating pipe', realPath: '/products_list_1/5.html'},
  {id: 'home', name: '顾地家装管系列', english: 'Home decoration pipe', realPath: '/products_list_1/11.html'},
  {id: 'other', name: '其它管网系列', english: 'Other pipeline networks', realPath: '/products_list_1/12.html'}
];

const pressures = ['0.63', '0.8', '1.0', '1.25', '1.6', '2.0', '2.5'];
// 演示站 /product_detail/51.html 的“PVC-U/UH给水管规格”表：公称外径 × 公称压力 → 公称壁厚（mm），“/”表示不提供。
const pvcWallRows = [
  ['20', '/', '/', '/', '/', '/', '2.0', '2.3'], ['25', '/', '/', '/', '/', '2.0', '2.3', '2.8'],
  ['32', '/', '/', '/', '2.0', '2.4', '2.9', '3.6'], ['40', '/', '/', '2.0', '2.4', '3.0', '3.7', '4.5'],
  ['50', '/', '2.0', '2.4', '3.0', '3.7', '4.6', '5.6'], ['63', '2.0', '2.5', '3.0', '3.8', '4.7', '5.8', '7.1'],
  ['75', '2.3', '2.9', '3.6', '4.5', '5.6', '6.9', '8.4'], ['90', '2.8', '3.5', '4.3', '5.4', '6.7', '8.2', '10.1'],
  ['110', '2.7', '3.4', '4.2', '5.3', '6.6', '8.1', '10.0'], ['125', '3.1', '3.9', '4.8', '6.0', '7.4', '9.2', '11.4'],
  ['140', '3.5', '4.3', '5.4', '6.7', '8.3', '10.3', '12.7'], ['160', '4.0', '4.9', '6.2', '7.7', '9.5', '11.8', '14.6'],
  ['180', '4.4', '5.5', '6.9', '8.6', '10.7', '13.3', '16.4'], ['200', '4.9', '6.2', '7.7', '9.6', '11.9', '14.7', '18.2'],
  ['225', '5.5', '6.9', '8.6', '10.8', '13.4', '16.6', '/'], ['250', '6.2', '7.7', '9.6', '11.9', '14.8', '18.4', '/'],
  ['280', '6.9', '8.6', '10.7', '13.4', '16.6', '20.6', '/'], ['315', '7.7', '9.7', '12.1', '15.0', '18.7', '23.2', '/'],
  ['355', '7.0', '8.7', '10.9', '13.6', '16.9', '21.1', '/'], ['400', '7.9', '9.8', '12.3', '15.3', '19.1', '23.7', '/'],
  ['450', '8.8', '11.0', '13.8', '17.2', '21.5', '26.7', '/'], ['500', '9.8', '12.3', '15.3', '19.1', '23.9', '29.7', '/'],
  ['560', '11.0', '13.7', '17.2', '21.4', '26.7', '33.2', '/'], ['630', '12.3', '15.4', '19.3', '24.1', '30.0', '37.4', '/']
];

const demoNote = '演示资料：用于走通流程，不代表真实产品参数。';

export const goodyProducts = [
  {
    id: 'pvcu-uh-water', name: 'PVC-U/UH给水管', categoryId: 'water', source: 'site', realPath: '/product_detail/51.html',
    summary: '发展成熟的供水管材，耐酸碱、耐腐蚀，耐压性能好，强度高、质轻，流体阻力小，无二次污染，符合卫生要求，施工方便。',
    intro: [
      'PVC-U/UH给水管是一种发展成熟的供水管材，具有耐酸、耐碱、耐腐蚀性强，耐压性能好，强度高，质轻，价格低，流体阻力小，无二次污染，符合卫生要求，施工操作方便等优越性能。',
      '采用优质卫生级聚氯乙烯树脂、钙锌或稀土稳定剂以及优质加工助剂为原料，生产的PVC-U/UH环保给水管通过了中国环境标志产品认证。'
    ],
    features: ['质量轻：单位长度重量只为铸铁管的1/6', '阻力小：内壁光滑不结垢，沿程水头损失比铸铁管低30%以上', '机械强度大：耐压、抗冲击、抗拉伸性能良好', '耐腐蚀：耐酸、耐碱、耐化学腐蚀', '易安装：柔性连接，胶圈密封', '寿命长：正常工作压力下使用寿命可达50年', '无毒卫生：使用无铅环保型热稳定剂，符合饮水标准', '造价低：工程总造价比铸铁管道节省30%'],
    applications: ['城市供水管道系统', '园林灌溉、凿井等工程及其他工业用管', '民用建筑、工业建筑的室内供水、中水系统', '海水养殖业', '水处理厂水处理管道系统', '居住小区、厂区埋地给水系统'],
    params: [{label: '材质', value: 'PVC-U（硬聚氯乙烯）'}, {label: '规格范围', value: '公称外径 dn20—dn630 mm'}, {label: '压力等级', value: '0.63—2.5 MPa'}, {label: '连接方式', value: '柔性连接，胶圈密封'}],
    certifications: ['中国环境标志产品认证'],
    specTables: [{
      title: 'PVC-U/UH给水管规格', rowHeader: '公称外径 dn（mm）', columnHeader: '公称压力（MPa）', cellMeaning: '公称壁厚（mm）',
      columns: pressures, rows: pvcWallRows.map(([dn, ...values]) => ({dn, values})), note: '“/”表示该外径与压力组合不提供。'
    }],
    tags: ['PVC-U', '给水', '市政供水', 'dn20—dn630']
  },
  {
    id: 'pe-water', name: 'PE给水管', categoryId: 'water', source: 'demo',
    summary: 'PE100 材质给水管，柔韧耐冲击，可热熔或电熔连接，适用于市政供水与埋地输水。',
    intro: ['PE给水管采用 PE100 原料生产，柔韧性好、耐冲击，热熔连接形成整体管网，适合市政供水、园区埋地给水等场景。', demoNote],
    features: ['柔韧耐冲击，适应地基沉降', '热熔/电熔连接，接口可靠', '耐腐蚀，内壁光滑'],
    applications: ['市政供水管网', '园区、小区埋地给水', '农田水利输水'],
    params: [{label: '材质', value: 'PE100'}, {label: '规格范围', value: 'dn20—dn800 mm'}, {label: '压力等级', value: '0.6—1.6 MPa'}, {label: '连接方式', value: '热熔 / 电熔'}],
    certifications: [], specTables: [], tags: ['PE100', '给水', '热熔']
  },
  {
    id: 'pvcu-drain', name: 'PVC-U排水管', categoryId: 'drainage', source: 'demo',
    summary: '建筑排水用硬聚氯乙烯管材，粘接施工，适用于室内排水系统。',
    intro: ['PVC-U排水管用于建筑室内排水与雨水系统，粘接施工便捷。', demoNote],
    features: ['内壁光滑不易结垢', '粘接施工便捷', '阻燃自熄'], applications: ['民用与公共建筑室内排水', '建筑雨水系统'],
    params: [{label: '材质', value: 'PVC-U'}, {label: '规格范围', value: 'dn50—dn200 mm'}, {label: '连接方式', value: '粘接'}],
    certifications: [], specTables: [], tags: ['PVC-U', '排水', '建筑']
  },
  {
    id: 'hdpe-corrugated', name: 'HDPE双壁波纹管', categoryId: 'drainage', source: 'demo',
    summary: '内壁光滑、外壁波纹的结构壁管，环刚度高，适用于市政排水排污。',
    intro: ['HDPE双壁波纹管为外壁波纹、内壁光滑的结构壁管材，适用于市政雨污排水与道路排水。', demoNote],
    features: ['环刚度高、重量轻', '承插胶圈连接', '耐腐蚀、寿命长'], applications: ['市政雨污排水', '道路、园区排水'],
    params: [{label: '材质', value: 'HDPE'}, {label: '规格范围', value: 'DN200—DN800'}, {label: '环刚度', value: 'SN4 / SN8'}],
    certifications: [], specTables: [], tags: ['HDPE', '双壁波纹管', '市政排水']
  },
  {
    id: 'mpp-power', name: 'MPP电力电缆护套管', categoryId: 'power', source: 'demo',
    summary: '改性聚丙烯电缆护套管，耐高温、强度高，适用于非开挖电力管线。',
    intro: ['MPP电力电缆护套管适用于城市电网改造、非开挖顶管等工程。', demoNote],
    features: ['耐高温、绝缘性好', '强度高，适合拖拉施工'], applications: ['城市电网改造', '非开挖电缆敷设'],
    params: [{label: '材质', value: '改性聚丙烯 MPP'}, {label: '规格范围', value: 'dn110—dn250 mm'}],
    certifications: [], specTables: [], tags: ['MPP', '电力', '非开挖']
  },
  {
    id: 'pvc-irrigation', name: 'PVC-U农用灌溉管', categoryId: 'irrigation', source: 'demo',
    summary: '农田水利与喷灌系统用 PVC-U 管材，承插连接，经济耐用。',
    intro: ['适用于农田灌溉、喷灌、滴灌输水干支管。', demoNote],
    features: ['经济耐用', '承插连接，施工快'], applications: ['农田水利', '喷灌、滴灌干支管'],
    params: [{label: '材质', value: 'PVC-U'}, {label: '规格范围', value: 'dn63—dn315 mm'}],
    certifications: [], specTables: [], tags: ['PVC-U', '灌溉', '农业']
  },
  {
    id: 'pe-aquaculture', name: 'PE渔业养殖管', categoryId: 'aquaculture', source: 'demo',
    summary: '海水与淡水养殖用 PE 管材，耐海水腐蚀、抗紫外线。',
    intro: ['适用于网箱框架、养殖场进排水等场景。', demoNote],
    features: ['耐海水腐蚀', '抗紫外线老化'], applications: ['网箱养殖框架', '养殖场进排水'],
    params: [{label: '材质', value: 'PE100'}, {label: '规格范围', value: 'dn110—dn500 mm'}],
    certifications: [], specTables: [], tags: ['PE', '养殖']
  },
  {
    id: 'pe-gas', name: 'PE燃气管', categoryId: 'gas', source: 'demo',
    summary: '城镇燃气输配用聚乙烯管材，热熔/电熔连接，密封可靠。',
    intro: ['适用于城镇中低压燃气输配管网。', demoNote],
    features: ['气密性好', '耐腐蚀、免防腐处理'], applications: ['城镇燃气中低压管网', '小区庭院燃气管'],
    params: [{label: '材质', value: 'PE100'}, {label: '规格范围', value: 'dn32—dn315 mm'}],
    certifications: [], specTables: [], tags: ['PE', '燃气']
  },
  {
    id: 'pert-heating', name: 'PE-RT地暖管', categoryId: 'heating', source: 'demo',
    summary: '耐热聚乙烯地面辐射采暖管，柔韧易弯，热稳定性好。',
    intro: ['适用于住宅与公共建筑地面辐射采暖。', demoNote],
    features: ['耐热性好', '柔韧易弯曲'], applications: ['地面辐射采暖'],
    params: [{label: '材质', value: 'PE-RT'}, {label: '规格范围', value: 'dn16—dn32 mm'}],
    certifications: [], specTables: [], tags: ['PE-RT', '地暖', '采暖']
  },
  {
    id: 'ppr-home', name: 'PPR家装给水管', categoryId: 'home', source: 'demo',
    summary: '家装冷热水给水管，热熔连接，卫生无毒。',
    intro: ['适用于住宅冷热水给水系统。', demoNote],
    features: ['热熔连接、整体无渗漏', '卫生无毒'], applications: ['住宅冷热水给水'],
    params: [{label: '材质', value: 'PP-R'}, {label: '规格范围', value: 'dn20—dn63 mm'}],
    certifications: [], specTables: [], tags: ['PPR', '家装', '给水']
  },
  {
    id: 'steel-belt', name: '钢带增强聚乙烯螺旋波纹管', categoryId: 'other', source: 'demo',
    summary: '钢带增强结构壁排水管，大口径、高环刚度，用于市政排水干线。',
    intro: ['适用于市政排水排污干线与大口径雨水管网。', demoNote],
    features: ['大口径、高环刚度', '电热熔带连接'], applications: ['市政排水干线', '大口径雨水管网'],
    params: [{label: '材质', value: 'HDPE + 钢带'}, {label: '规格范围', value: 'DN300—DN1800'}],
    certifications: [], specTables: [], tags: ['钢带增强', '排水']
  }
];

export const companyTopics = {
  profile: {title: '公司简介', text: '顾地，始创于1979年，于2012年8月16日在深圳证券交易所上市（股票名称：顾地科技，股票代码：002694）。总部位于湖北鄂州，拥有湖北、重庆、佛山、甘肃、北京生产基地，产品涉及 PVC/PE/PP 三大系列 10 余个品类、5000 多个规格，是塑料管道系统解决方案供应商。'},
  brands: {title: '品牌', text: '公司拥有“顾地”“得亿”“管扬”三大品牌，分别覆盖高端工程、民用建材及新型管道系统领域。'},
  history: {title: '品牌历史', items: ['1979年：顾地品牌创建', '1999年：湖北顾地塑胶有限公司成立（顾地科技前身）', '2012年：在深圳证券交易所上市', '2014年：新厂落成，院士工作站授牌', '2019年：顾地品牌40年', '2024年：万洋集团控股顾地科技']},
  organization: {title: '生产基地与营销网络', text: '拥有湖北、重庆、佛山、甘肃、北京等生产基地，营销网络遍布华北、华东、西南、西北、华南、华中，产品销往全国34个省（市）、自治区，并远销中亚、东南亚、非洲等国家和地区。'},
  strength: {title: '研发实力', text: '公司重视技术研发，先后申请产品专利170余项，在国内外公开发表学术论文近400篇；设有 CNAS 认可实验室。'},
  honors: {title: '资质荣誉', items: ['CNAS 认可实验室', '高新技术企业证书', 'AAA 级信用企业', '能源管理体系认证', '绿色建筑选用产品证书', '我最喜爱的湖北品牌银奖', 'PVC-U/UH 给水管通过中国环境标志产品认证']},
  culture: {title: '品牌文化', text: '使命：为客户提供高品质的产品和服务；用稳健和创新推动企业不断发展，为所有利益相关方创造持续的价值。'},
  contact: {title: '联系方式', contact: {
    serviceHotline: '400-105-1979', telephone: '+86 0711-3355689', fax: '+86 0711-3616559',
    address: '湖北省鄂州市经济开发区吴楚大道18号', productInquiry: '可在产品详情页“产品咨询”表单留资，或在“在线留言”页留言。'
  }}
};
export const companyTopicKeys = Object.keys(companyTopics);

/** 两张表单的已发布定义。字段键为演示示意；真实站须读取 e_form 的稳定字段标识。 */
export const goodyForms = {
  inquiry: {
    id: 'goody-product-inquiry', title: '产品咨询', webmcp: true, multiItem: false,
    realFieldNames: {contactName: 'name1710405159852', phone: 'mobile1710405122396', email: 'email1710405140587', region: 'e_input-41', inquiryContent: 'e_textarea-44'},
    fields: [
      {key: 'contactName', label: '你的名字', placeholder: '你的名字', type: 'string', required: false},
      {key: 'phone', label: '电话号码', placeholder: '您的电话号码', type: 'string', required: true, webmcpDescription: '联系人电话号码（手机或座机）'},
      {key: 'email', label: '电子邮件', placeholder: '您的电子邮件地址', type: 'string', format: 'email', required: true},
      {key: 'region', label: '所在地区', placeholder: '您所在的地区', type: 'string', required: false, webmcpDescription: '项目或采购方所在地区，如“湖北武汉”'},
      {key: 'inquiryContent', label: '详细说明', placeholder: '请说明规格、数量、项目地点和需要确认的问题', type: 'string', required: true, multiline: true, webmcpDescription: '咨询详情：规格、数量、项目地点、期望供货时间，以及需要销售确认的价格、交期、检测报告等问题'}
    ]
  },
  message: {
    id: 'goody-message', title: '在线留言', webmcp: true, multiItem: false, bindProduct: false,
    realFieldNames: {contactName: 'text1711552842573', phone: 'text1711552859516', email: 'text1727623015026', message: 'textarea1711552919507'},
    fields: [
      {key: 'contactName', label: '你的名字', placeholder: '你的名字', type: 'string', required: false},
      {key: 'phone', label: '电话号码', placeholder: '电话号码', type: 'string', required: true, webmcpDescription: '联系人电话号码（手机或座机）'},
      {key: 'email', label: '电子邮件', placeholder: '电子邮件地址', type: 'string', format: 'email', required: true},
      {key: 'message', label: '留言内容', placeholder: '请输入备注信息', type: 'string', required: true, multiline: true, webmcpDescription: '留言内容：采购需求、合作、经销、工程项目或售后等需要企业回复的事项'}
    ]
  }
};

/**
 * 一期只接入两张表单，不为其他页面增加留资工具：
 * - 产品详情：本页“产品咨询”表单 → request_quote / submit_quote（自动关联当前产品）
 * - 在线留言：本页“在线留言”表单 → request_message / submit_message
 * - 其余页面（首页、关于、联系、产品中心等）：用 open_site_page 跳转到在线留言页（redirect: 'message'）后再留资。
 *   演示站首页虽有“代理商加盟”表单（e_form-34），一期不接入 WebMCP。
 */
export function leadFormFor(view) {
  if (view === 'detail') return {form: goodyForms.inquiry, fill: 'request_quote', submit: 'submit_quote'};
  if (view === 'message') return {form: goodyForms.message, fill: 'request_message', submit: 'submit_message'};
  return {form: null, redirect: 'message'};
}

export const GOODY_PAGE_SIZE = 6;
export function goodyCategory(id) {return goodyCategories.find(c => c.id === id);}
export function goodyProduct(id) {return goodyProducts.find(p => p.id === id);}

export function searchGoodyProducts({keyword = '', categoryId, page = 1} = {}) {
  const words = String(keyword).trim().toLowerCase().split(/[\s,，、/]+/).filter(Boolean);
  const matched = goodyProducts.filter(p => {
    if (categoryId && p.categoryId !== categoryId) return false;
    const text = [p.name, p.summary, goodyCategory(p.categoryId).name, ...p.tags, ...p.params.map(x => x.value), ...p.applications].join(' ').toLowerCase();
    return words.every(w => text.includes(w));
  });
  const start = (page - 1) * GOODY_PAGE_SIZE;
  return {total: matched.length, hasMore: start + GOODY_PAGE_SIZE < matched.length, items: matched.slice(start, start + GOODY_PAGE_SIZE)};
}

export const productSections = ['overview', 'features', 'applications', 'params', 'specTables', 'certifications'];
export function productDetailResult(product, sections = productSections) {
  const category = goodyCategory(product.categoryId);
  const out = {status: 'ok', product: {id: product.id, name: product.name, category: category.name, summary: product.summary}};
  if (sections.includes('overview')) out.overview = product.intro;
  if (sections.includes('features')) out.features = product.features;
  if (sections.includes('applications')) out.applications = product.applications;
  if (sections.includes('params')) out.params = product.params;
  if (sections.includes('specTables')) out.specTables = product.specTables;
  if (sections.includes('certifications')) out.certifications = product.certifications;
  out.notProvided = ['价格', '交货期', '库存'];
  out.message = '仅返回本页公开资料。价格、交货期、库存未在官网公开。用户问到这些或有采购意向时，请引导用户留资：调用 request_quote 预填本页“产品咨询”表单，由销售确认。';
  return out;
}

export function companyInfoResult(topics = companyTopicKeys) {
  return {status: 'ok', company: goodySite.fullName, topics: Object.fromEntries(topics.map(key => [key, companyTopics[key]]))};
}
