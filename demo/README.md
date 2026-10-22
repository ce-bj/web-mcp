# WebMCP 官网询价演示

后台配置界面见 [admin.html](./admin.html)：属性模板的 WebMCP Tab、属性原编辑窗口中的“WebMCP 可查询”，以及 form 表单设置新增的 WebMCP Tab。产品编辑页说明具体产品值仍在原位置维护。页面可切换开关、编辑说明并保存到当前浏览器；这是用于评审的 HTML 原型，不连接真实中台，也不会修改前台演示工具。

本演示对应[询价产品设计 v0.21](../webmcp-inquiry-product-design.md)，使用虚构的“澄川管业”和“衡星精密”两家官网。入口页模拟 Agent 根据站点公开简介完成“发现、理解”；进入官网后才注册当前页的 WebMCP 工具。四项查找、咨询和预填工具是 `search_products`、`get_product_spec`、`check_lead_time`、`request_quote`；两项站内导航工具是 `open_product_detail` 和 `open_inquiry_form`。导航只打开原页面，不增改业务资料，也不提交询价。所有产品页 2 项工具、产品详情 3 项、询价页 1 项。询价工具只预填，原表单由用户点击提交。本地存储模拟回执，不会向真实企业发送信息。

## 启动

在本目录执行：

```bash
python3 -m http.server 8765
```

用支持 WebMCP 的 Chrome 打开 <http://localhost:8765/>。本地测试若未开放 WebMCP，在 `chrome://flags/#enable-webmcp-testing` 启用该功能并重启浏览器，再使用 **WebMCP - Model Context Tool Inspector**。右上角只有在实际 `registerTool` 成功后才显示工具数量；未启用时显示“WebMCP 未启用”。页面左侧始终可以手动切换，也可以让 Agent 在得到用户确认后调用导航工具。

上传到服务器后的浏览器启用、Origin Trial 和 Inspector 报错排查，见[仓库 README 的部署说明](../README.md#部署后看不到-webmcp-工具)。

Inspector 的聊天框和下方 **Tool / Input Arguments / Execute Tool** 是两种操作。聊天框已经找到产品，不代表下方手动执行框会自动填写真实参数。截图中 `"keyword":"example_string"` 是 Inspector 生成的占位值，直接点击 **Execute Tool** 就会搜索这个英文词，因此找不到管材。每个页面右侧的“手动执行 · Input Arguments”按当前 Tool 列出可复制的 JSON：先在 Inspector 选同名 Tool，再点“复制参数”，粘贴并执行。产品、表单或商品行变化后，页面会更新示例参数。

## 主流程：市政排水管材

每进入新页面，请让 Inspector 重新识别当前页工具。页面右侧也有逐页可复制的提问。

| 步骤 | 当前页 | 输入给 Inspector 的话 | 预期 |
|---|---|---|---|
| 1 | 两家官网 | 我要找市政排水用双壁波纹管，DN315、SN8，大约 1200 米。比较这两个官网简介，告诉我应该先进入哪家官网。 | 基于可见简介选择澄川管业；此页无 WebMCP 工具 |
| 2 | 澄川管业 → 所有产品 | 你们有适合市政排水用的 DN315、SN8 双壁波纹管吗？ | Agent 用 `search_products` 找到 `pipe-315`，页面也显示匹配结果，并征求是否打开 |
| 3 | 同一产品列表 | 好，打开这款产品的详情。 | Agent 用 `open_product_detail` 跳转当前产品详情 |
| 4 | 产品详情 | 这款产品的公称直径、环刚度和执行标准是什么？ | `get_product_spec({})` 返回 DN315、SN8、GB/T 19472.1 等当前产品值 |
| 5 | 同一详情页 | 我大概要 1200 米，12 月中旬希望发货。这款产品的交期是多久？ | `check_lead_time({})` 返回“预计 18 个工作日”；不能据此承诺本次订单日期 |
| 6 | 同一详情页 | 我想询价，顺便请对方确认能否满足发货时间，以及有没有第三方检测报告。 | Agent 用 `open_inquiry_form` 打开原询价页；未确认的检测报告进入询价内容 |
| 7 | 澄川管业 → 在线询价 | 这款产品要 1200 米，项目在江苏，希望 12 月中旬发货。联系人王宁，手机 13800138000，邮箱 wang.ning@example.com。也请对方确认第三方检测报告。 | `request_quote` 填入商品行、联系字段和询价内容，返回 `awaiting_user_submit` |
| 8 | 同一询价页 | 我先看看填写的内容，确认后自己提交。 | 用户核对后手动点击，页面才出现本地演示回执 |

第 7 步如果 Inspector 只会询问缺失信息，可在询价页复制 `request_quote` 的 Input Arguments。管材表单初始一行的示例是：

```json
{
  "items": [{"rowRef":"row_1","quantity":"1200 米"}],
  "contactName":"王宁",
  "phone":"13800138000",
  "email":"wang.ning@example.com",
  "inquiryContent":"项目在江苏，计划采购 DN315 / SN8 双壁波纹管约 1200 米，希望 12 月中旬发货。请确认能否满足目标日期，并提供第三方检测报告。"
}
```

## 第二家官网与动态表单

切换到“衡星精密 → 所有产品”，向 Inspector 输入：“你们有 6205-2RS 深沟球轴承吗？”确认后说：“好，打开它的详情。”详情页问：“这款轴承的型号、内径、材质和交期是什么？”然后说：“我想就这款轴承询价。”进入表单后说：“我要采购 200 件。联系人李工，工作邮箱 ligong@example.com；用于电机，请确认批量价格与交货期。”

这个站的 `get_product_spec.fieldKeys` 是轴承模板字段；`request_quote` 没有管材表单的 `items` 和 `phone`，而有必填的整数 `quantity`。不要把上一站的字段或商品引用带过来。

## 直接检查工具

在支持 WebMCP 的 Chrome 开发者工具中，也可运行：

```js
(await document.modelContext.getTools()).map(({name,description,inputSchema,annotations}) => ({name,description,inputSchema,annotations}))
```

管材详情应看到 `get_product_spec`、`check_lead_time`、`open_inquiry_form`；询价页只看到 `request_quote`。`request_quote` 的执行结果表示预填状态，用户手点提交后的页面回执是另一个时点。

WebMCP 浏览器启用与 Inspector 说明参考 [Chrome 官方文档](https://developer.chrome.com/docs/ai/webmcp/)，工具注册接口参考 [Imperative API](https://developer.chrome.com/docs/ai/webmcp/imperative-api)。
