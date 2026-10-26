# WebMCP 产品咨询与询价

这是企业网站中台的 WebMCP 询价场景产品设计及可交互原型。买家 Agent 在官网查找产品、打开详情、查询规格和交期，再进入现有询价表单辅助填写；买家核对后可自行提交，也可授权 Agent 提交并获取回执。项目版本处于 **0.x**，当前产品设计文档为 v0.22。

## 项目结构

| 路径                                                                                                         | 内容                                 |
| ---------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| [`index.html`](./index.html)                                                                               | 前台演示的根目录入口，直接加载页面与 WebMCP 工具       |
| [`webmcp-inquiry-product-design.md`](./webmcp-inquiry-product-design.md)                                   | 产品设计：目标与边界、流程、后台配置、工具字段、异常和验收示例    |
| [`webmcp-inquiry-product-design.assets/`](./webmcp-inquiry-product-design.assets/)                         | 产品文档引用的现有后台与表单截图                   |
| [`background/b2b-agent-ready-webmcp-standalone.html`](./background/b2b-agent-ready-webmcp-standalone.html) | 业务背景参考；本项目重点对应其中第 04 部分            |
| [`demo/index.html`](./demo/index.html)                                                                     | 前台演示入口：两家模拟官网、产品咨询和询价流程            |
| [`demo/admin.html`](./demo/admin.html)                                                                     | 后台配置原型：属性模板、产品编辑与 form 的 WebMCP 设置 |
| [`demo/catalog.js`](./demo/catalog.js)                                                                     | 演示产品、表单数据及由当前页面数据生成 Schema 的逻辑     |
| [`demo/app.js`](./demo/app.js)                                                                             | 前台页面渲染、WebMCP 工具注册、预填与本地提交回执       |
| [`demo/submission.js`](./demo/submission.js)                                                               | 前台手动提交与 WebMCP 提交共用的本地回执保存逻辑       |
| [`demo/admin.js`](./demo/admin.js)                                                                         | 后台原型交互与当前浏览器的配置保存                  |
| [`demo/manual-examples.js`](./demo/manual-examples.js)                                                     | Inspector 手动执行时可复制的参数示例            |

## 本地启动与进入页面

只需要 Python 3，无需安装依赖或执行构建。首次下载时，在终端运行：

```bash
git clone https://github.com/ce-bj/web-mcp.git
cd web-mcp
python3 -m http.server 8765
```

如果已经下载项目，先 `cd` 到**同时包含 `README.md`、根目录 `index.html` 和 `demo/` 文件夹**的目录，再运行 `python3 -m http.server 8765`。终端出现 `Serving HTTP on ... port 8765` 后，保持该终端运行，在浏览器打开下面的地址。不要在 `demo/` 文件夹内启动根目录服务；如果旧服务已占用 8765 端口，先在旧终端按 `Ctrl+C`，再从项目根目录启动。

| 要进入的页面 | 浏览器地址 |
| --- | --- |
| 首页：选择两家模拟官网 | [http://localhost:8765/](http://localhost:8765/) |
| 澄川管业：所有产品 | [http://localhost:8765/?view=products&site=pipe](http://localhost:8765/?view=products&site=pipe) |
| 澄川管业：产品详情 | [http://localhost:8765/?view=detail&site=pipe&product=pipe-315](http://localhost:8765/?view=detail&site=pipe&product=pipe-315) |
| 澄川管业：在线询价 | [http://localhost:8765/?view=quote&site=pipe&product=pipe-315](http://localhost:8765/?view=quote&site=pipe&product=pipe-315) |
| 后台配置原型 | [http://localhost:8765/demo/admin.html](http://localhost:8765/demo/admin.html) |

也可以只打开首页，使用页面左侧导航切换产品、详情与询价页面，或点右上角「后台配置」。启动命令运行的终端按 `Ctrl+C` 可停止服务。如果 8765 端口被其他服务占用，可将命令中的 `8765` 改为 `8766`，访问地址中的端口也同步改为 `8766`。请通过 HTTP 服务访问，不要直接双击 HTML 文件；页面使用 ES modules 和 WebMCP 浏览器接口。

## 上传到服务器后

把**整个仓库目录**放到 Nginx 网站根目录，确保同一目录下有 `index.html` 和 `demo/`。例如部署在 `/var/www/web-mcp` 时，Nginx 的 `root` 指向 `/var/www/web-mcp`，`index` 使用 `index.html`；无需运行 Python 服务、Vite 或构建 `dist/`。访问 `https://你的域名/` 进入首页，访问 `https://你的域名/demo/admin.html` 进入后台配置原型。浏览器打开根目录页面后，样式和脚本还会从 `/demo/` 加载，因此部署时不能只上传单独的 `index.html`。线上要使用 WebMCP 工具，还需要 HTTPS 与下文所述的浏览器启用条件。

前台两家官网及后台页面均为**模拟数据与原型**。后台设置保存在浏览器 `localStorage`，尚未连接真实中台，也不会实时改变前台工具。询价提交同样只写入浏览器本地存储，不发送给真实企业。产品文档描述的是中台应实现的业务规则，原型用于验证交互和当前页面工具定义；文档中的示意字段标识、截图商品与原型测试数据不必完全相同。

## 体验与验证

前台的“官网选择”页模拟发现与理解；进入任一模拟官网后，当前产品列表、详情或询价页才注册相应的 WebMCP 工具。`request_quote` 只预填，`submit_quote` 在用户核对并明确授权后请求页面确认、提交当前表单并返回回执；手动提交仍可用。页面右上角只有在实际注册成功后才显示工具数量。若本地 Chrome 尚未开放 WebMCP，先启用 `chrome://flags/#enable-webmcp-testing` 并重启浏览器，再使用 **WebMCP - Model Context Tool Inspector**；服务器部署的启用条件见下文。WebMCP 未启用时仍可手动浏览和填写表单。

Inspector 的聊天框与下方 **Tool / Input Arguments / Execute Tool** 是两种操作。聊天框找到了产品，不会自动替下方手动执行框填入参数；其中的 `"keyword":"example_string"` 是占位值，直接执行只会搜索这个英文词。每个前台页面右侧都列出当前工具可复制的 JSON。手动执行时，先在 Inspector 选择同名 Tool，再复制参数到 **Input Arguments**。切换页面或修改商品行后，重新读取当前页工具和参数。

### 主流程：市政排水管材

| 步骤 | 当前页 | 输入给 Inspector 的话 | 预期 |
| --- | --- | --- | --- |
| 1 | 两家官网 | 我要找市政排水用双壁波纹管，DN315、SN8，大约 1200 米。比较这两个官网简介，告诉我应该先进入哪家官网。 | 基于可见简介选择澄川管业；此页无 WebMCP 工具 |
| 2 | 澄川管业 → 所有产品 | 你们有适合市政排水用的 DN315、SN8 双壁波纹管吗？ | `search_products` 找到产品并询问是否打开 |
| 3 | 同一产品列表 | 好，打开这款产品的详情。 | `open_product_detail` 打开详情页 |
| 4 | 产品详情 | 这款产品的公称直径、环刚度和执行标准是什么？ | `get_product_spec({})` 返回当前产品的已开放规格 |
| 5 | 同一详情页 | 我大概要 1200 米，12 月中旬希望发货。这款产品的交期是多久？ | `check_lead_time({})` 返回原交期，不承诺本次订单日期 |
| 6 | 同一详情页 | 我想询价，顺便请对方确认能否满足发货时间，以及有没有第三方检测报告。 | `open_inquiry_form` 打开原询价页；待确认事项进入询价内容 |
| 7 | 澄川管业 → 在线询价 | 这款产品要 1200 米，项目在江苏，希望 12 月中旬发货。联系人王宁，手机 13800138000，邮箱 wang.ning@example.com。也请对方确认第三方检测报告。 | `request_quote` 预填商品行和联系字段，返回 `awaiting_user_confirmation`，不产生回执 |
| 8 | 同一询价页 | 我已经核对表单，信息无误。请提交这份询价，并告诉我回执编号。 | `submit_quote({})` 请求页面确认；确认后返回 `submitted` 和本地演示回执，也可手动点击提交按钮 |

第 7 步如需手动执行 `request_quote`，管材表单初始一行的 **Input Arguments** 示例为：

```json
{
  "items": [{"rowRef":"row_1","quantity":"1200 米"}],
  "contactName":"王宁",
  "phone":"13800138000",
  "email":"wang.ning@example.com",
  "inquiryContent":"项目在江苏，计划采购 DN315 / SN8 双壁波纹管约 1200 米，希望 12 月中旬发货。请确认能否满足目标日期，并提供第三方检测报告。"
}
```

第 8 步选择 `submit_quote`，将 `{}` 填入 **Input Arguments**。页面会再弹出确认框，用户确认后才会保存本地演示记录。成功结果中的 `receipt.id`、`receipt.submittedAt` 来自这次本地保存，`receipt.mode` 为 `demo_local`；取消返回 `cancelled`，校验失败返回 `validation_error`，结果不能确认时返回 `unknown`，不要自动重复提交。

### 第二家官网与动态表单

切换到“衡星精密 → 所有产品”，向 Inspector 输入：“你们有 6205-2RS 深沟球轴承吗？”确认后说：“好，打开它的详情。”详情页问：“这款轴承的型号、内径、材质和交期是什么？”然后说：“我想就这款轴承询价。”进入表单后说：“我要采购 200 件。联系人李工，工作邮箱 ligong@example.com；用于电机，请确认批量价格与交货期。”

该站的 `get_product_spec.fieldKeys` 来自轴承属性模板。其 `request_quote.inputSchema` 没有管材表单的 `items` 和 `phone`，但有必填整数 `quantity`。切换表单后须重新读取 Schema，不能沿用上一站的字段或商品引用。

### 直接检查工具与本地校验

在支持 WebMCP 的 Chrome 开发者工具中可运行：

```js
(await document.modelContext.getTools()).map(({name,description,inputSchema,annotations}) => ({name,description,inputSchema,annotations}))
```

产品列表页应有 `search_products`、`open_product_detail`，产品详情页应有 `get_product_spec`、`check_lead_time`、`open_inquiry_form`，询价页应有 `request_quote`、`submit_quote`。工具定义参见 [Chrome WebMCP 文档](https://developer.chrome.com/docs/ai/webmcp/imperative-api)。本地校验需要 Node.js：

```bash
node --test demo/*.test.mjs
node --check demo/app.js
node --check demo/submission.js
node --check demo/admin.js
```

本项目没有构建步骤。演示覆盖主流程；关闭开关、字段缺值及故障等异常的产品规则和验收场景见独立的[产品设计文档](./webmcp-inquiry-product-design.md)。

## 部署后看不到 WebMCP 工具

上传静态文件只能让网页可访问，不能替访问者开启 Chrome 的实验性 WebMCP 接口。若 Inspector 显示 `You must run Chrome with the "WebMCP for testing" flag enabled`，这是 Inspector 在当前页面读不到 `document.modelContext` 时给出的错误，不是本站的服务器错误。

**内网服务器示例：**`http://10.24.53.237:4182/` 是非回环地址上的明文 HTTP，不属于浏览器默认的安全上下文；即使页面和 JavaScript 已更新、Chrome 测试开关已启用，`document.modelContext` 仍可能不存在。推荐在服务器前配置 HTTPS 反向代理，让浏览器访问受信任的 `https://` 地址，再按下文启用 WebMCP。仅供本机临时调试时，也可通过 SSH 端口转发从访问者自己的电脑打开 `http://localhost:4182/`；此时浏览器看到的是本机 `localhost`。两种方式都不需要修改表单或工具代码。[安全上下文的地址判定](https://www.w3.org/TR/secure-contexts/#is-origin-trustworthy)

**供开发者用 Inspector 演示：**&#x5728;实际打开部署站点的同一个 Google Chrome 中访问 `chrome://version` 核对版本；[Inspector 项目要求 Chrome 150.0.7861.0 或更高，并启用测试开关](https://github.com/beaufortfrancois/model-context-tool-inspector#prerequisites)。进入 `chrome://flags/#enable-webmcp-testing`，设为 **Enabled**，点击 **Relaunch**，重新打开站点并刷新 Inspector。若开关不存在，先更新 Chrome；不要把服务器上的 Chrome 设置和访问者自己电脑上的 Chrome 混为一谈。

**希望访问者不手动开测试开关：**&#x6309; [Chrome WebMCP 文档](https://developer.chrome.com/docs/ai/webmcp/)申请当前 HTTPS 域名的 WebMCP Origin Trial，并按照 [Origin Trial 接入说明](https://developer.chrome.com/docs/web-platform/origin-trials)把该域名的有效 token 放入每个需要使用工具的页面的 `Origin-Trial` 响应头，或放入该页面 `<head>` 的 `<meta http-equiv="origin-trial" content="实际申请的 TOKEN">`。本演示的根目录 `index.html` 与 `demo/index.html` 都会注册工具，后台 `demo/admin.html` 不注册工具。Token 需要与访问页面的 origin 匹配；不能把示例占位字符串直接上传。Inspector 本身仍是开发测试工具，应按其文档使用支持的 Chrome 与测试开关。

在目标页面的 Chrome DevTools Console 输入 `location.origin` 和 `typeof document.modelContext?.registerTool`：先确认访问的是 HTTPS 或本机 localhost；后者返回 `"function"` 才说明当前页面有注册接口。返回 `"undefined"` 时依次检查地址是否为安全上下文、浏览器版本、flag 或 Origin Trial token。接口可用后，本站产品列表页右上角应显示 `2 WebMCP tools ready`，详情页显示 3 项，询价页显示 2 项；“官网选择”页本来就没有工具。
