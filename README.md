# WebMCP 产品咨询与询价

这是企业网站中台的 WebMCP 询价场景产品设计及可交互原型。买家 Agent 在官网查找产品、打开详情、查询规格和交期，再进入现有询价表单辅助填写；买家核对后亲自提交。项目版本处于 **0.x**，当前产品设计文档为 v0.21。

## 项目结构

| 路径 | 内容 |
| --- | --- |
| [`index.html`](./index.html) | 前台演示的根目录入口，直接加载页面与 WebMCP 工具 |
| [`webmcp-inquiry-product-design.md`](./webmcp-inquiry-product-design.md) | 产品设计：目标与边界、流程、后台配置、工具字段、异常和验收示例 |
| [`webmcp-inquiry-product-design.assets/`](./webmcp-inquiry-product-design.assets/) | 产品文档引用的现有后台与表单截图 |
| [`background/b2b-agent-ready-webmcp-standalone.html`](./background/b2b-agent-ready-webmcp-standalone.html) | 业务背景参考；本项目重点对应其中第 04 部分 |
| [`demo/index.html`](./demo/index.html) | 前台演示入口：两家模拟官网、产品咨询和询价流程 |
| [`demo/admin.html`](./demo/admin.html) | 后台配置原型：属性模板、产品编辑与 form 的 WebMCP 设置 |
| [`demo/catalog.js`](./demo/catalog.js) | 演示产品、表单数据及由当前页面数据生成 Schema 的逻辑 |
| [`demo/app.js`](./demo/app.js) | 前台页面渲染、WebMCP 工具注册、预填与本地提交回执 |
| [`demo/admin.js`](./demo/admin.js) | 后台原型交互与当前浏览器的配置保存 |
| [`demo/manual-examples.js`](./demo/manual-examples.js) | Inspector 手动执行时可复制的参数示例 |
| [`demo/README.md`](./demo/README.md) | 逐页提问脚本与 Inspector 操作说明 |

## 启动

无需安装依赖。从仓库根目录运行：

```bash
python3 -m http.server 8765
```

打开 [项目首页](http://localhost:8765/)即可进入前台演示；也可以带参数访问，例如 `/?view=products&site=pipe`。前台右上角的「后台配置」按钮可打开后台原型，也可以直接访问 [后台配置](http://localhost:8765/demo/admin.html)。Nginx 部署时将网站根目录指向本仓库，直接返回根目录 `index.html` 即可；项目没有 Vite 构建步骤，也没有 `dist/index.html`。请通过 HTTP 服务访问，不要直接双击 HTML 文件；页面使用 ES modules 和 WebMCP 浏览器接口。

前台两家官网及后台页面均为**模拟数据与原型**。后台设置保存在浏览器 `localStorage`，尚未连接真实中台，也不会实时改变前台工具。询价提交同样只写入浏览器本地存储，不发送给真实企业。产品文档描述的是中台应实现的业务规则，原型用于验证交互和当前页面工具定义；文档中的示意字段标识、截图商品与原型测试数据不必完全相同。

## 体验与验证

前台的“官网选择”页模拟发现与理解；进入任一模拟官网后，当前产品列表、详情或询价页才注册相应的 WebMCP 工具。使用支持 WebMCP 的 Chrome 及 **WebMCP - Model Context Tool Inspector** 体验时，按 [`demo/README.md`](./demo/README.md) 的自然语言脚本逐页提问。模型未正确调用时，可复制页面右侧的 **Input Arguments** JSON，在 Inspector 选择同名工具手动执行。WebMCP 未启用时，页面仍可手动浏览和填写表单。浏览器启用方式见 [Chrome WebMCP 文档](https://developer.chrome.com/docs/ai/webmcp/)。

需要 Node.js 运行本地校验：

```bash
node --test demo/catalog.test.mjs
node --check demo/app.js
node --check demo/admin.js
```

本项目没有构建步骤。演示覆盖主流程；产品文档中的关闭开关、字段缺值、故障等异常为产品规则与验收场景，前台演示没有逐项制作状态切换器。

## 部署后看不到 WebMCP 工具

上传静态文件只能让网页可访问，不能替访问者开启 Chrome 的实验性 WebMCP 接口。若 Inspector 显示 `You must run Chrome with the "WebMCP for testing" flag enabled`，这是 Inspector 在当前页面读不到 `document.modelContext` 时给出的错误，不是本站的服务器错误。

**供开发者用 Inspector 演示：**在实际打开部署站点的同一个 Google Chrome 中访问 `chrome://version` 核对版本；[Inspector 项目要求 Chrome 150.0.7861.0 或更高，并启用测试开关](https://github.com/beaufortfrancois/model-context-tool-inspector#prerequisites)。进入 `chrome://flags/#enable-webmcp-testing`，设为 **Enabled**，点击 **Relaunch**，重新打开站点并刷新 Inspector。若开关不存在，先更新 Chrome；不要把服务器上的 Chrome 设置和访问者自己电脑上的 Chrome 混为一谈。

**希望访问者不手动开测试开关：**按 [Chrome WebMCP 文档](https://developer.chrome.com/docs/ai/webmcp/)申请当前 HTTPS 域名的 WebMCP Origin Trial，并按照 [Origin Trial 接入说明](https://developer.chrome.com/docs/web-platform/origin-trials)把该域名的有效 token 放入每个需要使用工具的页面的 `Origin-Trial` 响应头，或放入该页面 `<head>` 的 `<meta http-equiv="origin-trial" content="实际申请的 TOKEN">`。本演示的工具在 `demo/index.html` 中运行，后台 `admin.html` 不注册工具。Token 需要与访问页面的 origin 匹配；不能把示例占位字符串直接上传。Inspector 本身仍是开发测试工具，应按其文档使用支持的 Chrome 与测试开关。

在目标页面的 Chrome DevTools Console 输入 `typeof document.modelContext?.registerTool`：结果为 `"function"` 才说明当前页面有注册接口；结果为 `"undefined"` 时先检查浏览器版本、flag 或 Origin Trial token。若服务器使用非 localhost 的 HTTP 地址，先改为 HTTPS；WebMCP 接口要求安全上下文。接口可用后，本站产品列表页右上角应显示 `2 WebMCP tools ready`，详情页显示 3 项，询价页显示 1 项；“官网选择”页本来就没有工具。
