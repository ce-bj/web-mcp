import test from 'node:test';
import assert from 'node:assert/strict';
import {searchSuppliers, inspectSupplier, suppliers} from './discovery.js';
import {goodyProducts, goodyProduct, goodyForms, goodyCategories, searchGoodyProducts, productDetailResult, companyInfoResult, companyTopicKeys, leadFormFor} from './goody-data.js';
import {GOODY_VIEWS} from './goody-views.js';
import {quoteSchema} from './catalog.js';
import {manualExamplesForPage} from './manual-examples.js';

const NEED = '我在湖北做城市供水项目，需要 PVC-U 给水管 dn110、1.6MPa，约 2000 米。要求是生产厂家，有环保或卫生相关认证。';

test('发现层：修正后顾地排第一，现状快照下摘要不相关、排名靠后', () => {
  const fixed = searchSuppliers(NEED, 'fixed').results;
  assert.equal(fixed[0].siteId, 'goody');
  const current = searchSuppliers(NEED, 'current').results;
  const goody = current.find(r => r.siteId === 'goody');
  assert.ok(goody.rank > 1);
  assert.equal(goody.title, 'Magnetic building blocks');
  assert.deepEqual(goody.matchedInSnippet, []);
  assert.ok(!current.some(r => ['mingjing', 'bearing'].includes(r.siteId)));
});

test('发现层：英文 pipe 不会被当成 PE，排水需求优先澄川', () => {
  const drain = searchSuppliers('市政排水 HDPE 双壁波纹管 DN315 SN8', 'fixed').results;
  assert.equal(drain[0].siteId, 'pipe');
  const peOnly = searchSuppliers('PE 给水管', 'current').results.find(r => r.siteId === 'goody');
  assert.ok(peOnly.matchedElsewhere.includes('PE'));
  const pipeWord = searchSuppliers('PE', 'fixed').results.map(r => r.siteId);
  assert.ok(!pipeWord.includes('pipe') && !pipeWord.includes('etong'));
});

test('发现层：inspect 返回原始信号，现状有两个 Organization', () => {
  assert.equal(inspectSupplier('goody', 'current').structuredData.organizations.length, 2);
  assert.equal(inspectSupplier('goody', 'fixed').structuredData.organizations.length, 1);
  assert.equal(inspectSupplier('nope'), null);
  assert.ok(suppliers.filter(s => s.openUrl).every(s => ['goody', 'pipe', 'bearing'].includes(s.id)));
});

test('顾地产品查找按关键词和分类过滤', () => {
  assert.deepEqual(searchGoodyProducts({keyword: 'PVC 给水管'}).items.map(p => p.id), ['pvcu-uh-water']);
  assert.equal(searchGoodyProducts({categoryId: 'water'}).total, 2);
  assert.equal(searchGoodyProducts({keyword: '轴承'}).total, 0);
  const all = searchGoodyProducts({});
  assert.equal(all.total, goodyProducts.length);
  assert.equal(all.hasMore, true);
  assert.equal(searchGoodyProducts({page: 2}).hasMore, false);
  assert.ok(goodyProducts.every(p => goodyCategories.some(c => c.id === p.categoryId)));
});

test('顾地产品详情：规格表可查 dn110 × 1.6MPa，价格交期不提供', () => {
  const detail = productDetailResult(goodyProduct('pvcu-uh-water'));
  const table = detail.specTables[0];
  assert.equal(table.rows.find(r => r.dn === '110').values[table.columns.indexOf('1.6')], '6.6');
  assert.ok(table.rows.every(r => r.values.length === table.columns.length));
  assert.deepEqual(detail.notProvided, ['价格', '交货期', '库存']);
  assert.ok(!('leadTime' in detail) && !('price' in detail));
  const slim = productDetailResult(goodyProduct('pvcu-uh-water'), ['certifications']);
  assert.equal(slim.specTables, undefined);
  assert.deepEqual(slim.certifications, ['中国环境标志产品认证']);
});

test('顾地公司信息按主题返回', () => {
  assert.deepEqual(Object.keys(companyInfoResult(['contact']).topics), ['contact']);
  assert.deepEqual(Object.keys(companyInfoResult().topics), companyTopicKeys);
});

test('顾地两张表单生成各自的 Schema', () => {
  const inquiry = quoteSchema(goodyForms.inquiry);
  assert.deepEqual(inquiry.required, ['phone', 'email', 'inquiryContent']);
  assert.ok(!('items' in inquiry.properties));
  assert.match(inquiry.properties.inquiryContent.description, /价格、交期/);
  const message = quoteSchema(goodyForms.message);
  assert.deepEqual(message.required, ['phone', 'email', 'message']);
  assert.equal(goodyForms.message.bindProduct, false);
});

test('手动示例覆盖发现页和顾地各页面', () => {
  assert.deepEqual(manualExamplesForPage({view: 'discover'}).map(x => x.name), ['search_suppliers', 'inspect_supplier', 'open_supplier_site']);
  const product = goodyProduct('pvcu-uh-water');
  assert.deepEqual(manualExamplesForPage({view: 'detail', siteKey: 'goody', product}).slice(0, 3).map(x => x.name), ['get_product_detail', 'request_quote', 'submit_quote']);
  for (const view of ['home', 'message']) {
    const names = manualExamplesForPage({view, siteKey: 'goody', product}).map(x => x.name);
    assert.ok(names.includes('request_message') && names.includes('submit_message'), view);
  }
  for (const view of ['company', 'contact', 'products']) {
    const names = manualExamplesForPage({view, siteKey: 'goody', product}).map(x => x.name);
    assert.ok(!names.includes('request_message') && names.includes('open_site_page'), view);
  }
  assert.ok('address' in manualExamplesForPage({view: 'home', siteKey: 'goody', product}).find(x => x.name === 'request_message').args);
});

test('留资工具只出现在有表单的页面，其余页面跳转到在线留言', () => {
  const withForm = GOODY_VIEWS.filter(v => leadFormFor(v).form);
  assert.deepEqual(withForm.sort(), ['detail', 'home', 'message']);
  assert.equal(leadFormFor('detail').fill, 'request_quote');
  assert.equal(leadFormFor('home').form, goodyForms.homeLead);
  for (const view of ['company', 'contact', 'products']) assert.equal(leadFormFor(view).redirect, 'message');
  const home = quoteSchema(goodyForms.homeLead);
  assert.deepEqual(home.required, ['phone', 'email', 'address', 'message']);
});
