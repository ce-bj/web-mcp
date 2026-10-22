export const sites = {
  pipe: {
    name: '澄川管业', english: 'CHENGCHUAN PIPE SYSTEMS',
    initials: 'CC', category: '市政排水与地下管网', color: 'pipe',
    summary: '面向市政排水、道路与园区管网项目，提供双壁波纹管及配套管件。',
    location: '江苏 · 常州', formName: '在线询价',
    products: [
      {
        id: 'pipe-315', name: 'HDPE 双壁波纹管 DN315 / SN8', model: 'CC-HDPE-DN315-SN8',
        category: '双壁波纹管', intro: '市政排水常用口径，适用于道路、园区与雨污分流工程。',
        tags: ['DN315', 'SN8', '市政排水'], published: true,
        attrs: {
          nominalDiameter: {label:'公称直径', value:'DN315', open:true},
          ringStiffness: {label:'环刚度', value:'SN8', open:true},
          standard: {label:'执行标准', value:'GB/T 19472.1', open:true},
          material: {label:'材质', value:'HDPE', open:true},
          testReport: {label:'第三方检测报告', value:'', open:true},
          weight: {label:'重量', value:'按规格核算', open:false}
        },
        leadTime: {value:'预计 18 个工作日', open:true}
      },
      {
        id: 'pipe-400', name: 'HDPE 双壁波纹管 DN400 / SN8', model: 'CC-HDPE-DN400-SN8',
        category: '双壁波纹管', intro: '用于较大流量雨污排水支线，规格与交付信息独立维护。',
        tags: ['DN400', 'SN8', '雨污分流'], published: true,
        attrs: {
          nominalDiameter: {label:'公称直径', value:'DN400', open:true},
          ringStiffness: {label:'环刚度', value:'SN8', open:true},
          standard: {label:'执行标准', value:'GB/T 19472.1', open:true},
          material: {label:'材质', value:'HDPE', open:true},
          testReport: {label:'第三方检测报告', value:'可在询价中申请', open:true},
          weight: {label:'重量', value:'按规格核算', open:false}
        },
        leadTime: {value:'预计 25 个工作日', open:true}
      },
      {
        id: 'pipe-fitting', name: 'HDPE 双壁波纹管配套管件', model: 'CC-HDPE-FITTING',
        category: '配套管件', intro: '承插接头、密封圈等配套产品，按工程清单选型。',
        tags: ['管件', '连接件'], published: true,
        attrs: {
          material: {label:'材质', value:'HDPE / 橡胶', open:true},
          standard: {label:'执行标准', value:'按具体管件确认', open:true},
          weight: {label:'重量', value:'', open:false}
        },
        leadTime: {value:'', open:true}
      },
      {id:'pipe-hidden',name:'内部测试管材',model:'INTERNAL-01',published:false,tags:[],attrs:{},leadTime:{value:'3 天',open:true}}
    ]
  },
  bearing: {
    name: '衡星精密', english: 'HENGXING PRECISION BEARINGS',
    initials: 'HX', category: '工业传动与精密轴承', color: 'bearing',
    summary: '提供电机、输送设备与通用机械用轴承及选型支持。',
    location: '浙江 · 宁波', formName: '产品询价',
    products: [
      {
        id:'bearing-6205',name:'6205-2RS 深沟球轴承',model:'HX-6205-2RS',category:'深沟球轴承',
        intro:'双面密封结构，适用于电机与通用传动设备。',tags:['6205','轴承','电机'],published:true,
        attrs:{model:{label:'型号',value:'6205-2RS',open:true},innerDiameter:{label:'内径',value:'25 mm',open:true},material:{label:'材质',value:'轴承钢',open:true},seal:{label:'密封形式',value:'双面橡胶密封',open:true},weight:{label:'重量',value:'约 0.13 kg',open:false}},
        leadTime:{value:'预计 7 个工作日',open:true}
      },
      {
        id:'bearing-6308',name:'6308-ZZ 深沟球轴承',model:'HX-6308-ZZ',category:'深沟球轴承',
        intro:'双面防尘盖结构，适用于工业传动及通用机械。',tags:['6308','轴承','机械'],published:true,
        attrs:{model:{label:'型号',value:'6308-ZZ',open:true},innerDiameter:{label:'内径',value:'40 mm',open:true},material:{label:'材质',value:'轴承钢',open:true},seal:{label:'密封形式',value:'双面金属防尘盖',open:true},weight:{label:'重量',value:'约 0.64 kg',open:false}},
        leadTime:{value:'预计 12 个工作日',open:true}
      }
    ]
  }
};

export const formDefinitions = {
  pipe: {
    id:'inquiry-pipe', title:'在线询价', webmcp:true, multiItem:true,
    lineFields:[
      {key:'expectedPrice',label:'期望价格',placeholder:'请输入期望价格',type:'string',required:false},
      {key:'quantity',label:'预订数量',placeholder:'请输入预订数量',type:'string',required:false}
    ],
    fields:[
      {key:'contactName',label:'姓名',placeholder:'请输入姓名',type:'string',required:true},
      {key:'phone',label:'手机',placeholder:'请输入手机号',type:'string',required:true,webmcpDescription:'采购联系人手机号'},
      {key:'email',label:'邮箱',placeholder:'请输入邮箱',type:'string',format:'email',required:true},
      {key:'inquiryContent',label:'询价内容',placeholder:'请输入询价内容',type:'string',required:true,multiline:true}
    ]
  },
  bearing: {
    id:'inquiry-bearing',title:'产品询价',webmcp:true,multiItem:false,
    fields:[
      {key:'quantity',label:'采购数量',placeholder:'请输入采购数量（件）',type:'integer',minimum:1,required:true},
      {key:'contactName',label:'联系人',placeholder:'请输入联系人姓名',type:'string',required:true},
      {key:'email',label:'工作邮箱',placeholder:'请输入接收报价的邮箱',type:'string',format:'email',required:true},
      {key:'inquiryContent',label:'需求说明',placeholder:'如使用设备、期望到货时间',type:'string',required:false,multiline:true}
    ]
  }
};

export function publicProducts(siteKey){return sites[siteKey].products.filter(p=>p.published);}
export function getProduct(siteKey,id){return publicProducts(siteKey).find(p=>p.id===id);}
export function fieldDescription(field){return field.webmcpDescription || `${field.label}：${field.placeholder}`;}
export function availableAttrKeys(product){return Object.entries(product.attrs).filter(([,a])=>a.open && a.label).map(([key])=>key);}

export function specSchema(product){
  const keys=availableAttrKeys(product);
  const properties=keys.length ? {fieldKeys:{type:'array',description:`可选查询项：${keys.map(k=>`${k}=${product.attrs[k].label}`).join('；')}。不传时读取全部已开放资料。`,items:{type:'string',enum:keys},minItems:1,uniqueItems:true}} : {};
  return {type:'object',properties,additionalProperties:false};
}

export function quoteSchema(form,rows=[]){
  const properties={};
  if(form.multiItem){
    const rowRefs=rows.map(r=>r.ref);
    properties.items={type:'array',description:'填写当前表单已关联的商品行；未指定的行保持原值。',items:{type:'object',properties:{rowRef:{type:'string',description:'当前商品行引用；请使用本页实际可用的 rowRef。',enum:rowRefs},...Object.fromEntries(form.lineFields.map(f=>[f.key,{type:f.type,description:fieldDescription(f)}]))},required:['rowRef'],additionalProperties:false}};
  }
  for(const field of form.fields){
    const prop={type:field.type,description:fieldDescription(field)};
    if(field.format)prop.format=field.format;
    if(field.minimum!==undefined)prop.minimum=field.minimum;
    properties[field.key]=prop;
  }
  return {type:'object',properties,required:form.fields.filter(f=>f.required).map(f=>f.key),additionalProperties:false};
}

export function searchCatalog(siteKey,keyword='',page=1,pageSize=2){
  const words=String(keyword).trim().toLowerCase().split(/\s+/).filter(Boolean);
  const matched=publicProducts(siteKey).filter(p=>{
    const searchable=[p.name,p.model,p.category,p.intro,...p.tags,...Object.values(p.attrs).filter(a=>a.open).map(a=>a.value)].join(' ').toLowerCase();
    return words.every(w=>searchable.includes(w));
  });
  const start=(page-1)*pageSize;
  return {total:matched.length,hasMore:start+pageSize<matched.length,items:matched.slice(start,start+pageSize)};
}
