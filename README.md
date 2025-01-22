## Changelog

### [Version 1.0.5_0824] - 2024-09-07

### commit:2c0f4563baa511dbe4c1c03c37b9f3d42b380b59

#### Added

- **支付测试：** 增加支付功能测试

### [Version 1.0.5_0824] - 2024-09-07

### commit:29f7177947e7525bc6a3c6755ef44f0b2c7c917e

#### Added

- **合同模板：** 增加合同模板以及合同收藏的功能

### [Version 1.0.5_0824] - 2024-09-07

### commit:8bb2ac18f4e4f9ea3299dd729ff950e310dec340

#### Added

- **新建页面：** 增加会员充值、获取积分、合同模板收藏、我的订单、所有权益页面

### [Version 1.0.5_0824] - 2024-08-24

### commit:b103d821447ac2f22935beadf918f2a715d1583b

#### Added

- **页面分享：** 新添了主页和历史记录页面的个人分享功能。

### [Version 1.0.5_0824] - 2024-08-24

### commit:53e48fc98a87bc5d4cb0d5ab76380d171d775b6b

#### Fixed

- **主体审查：** 修复了点击主体审查后, 页面loading不关闭且没有提示信息的问题。

### [Version 1.0.5_0821] - 2024-08-21

### commit:51735323d84734d85ac3057bfd3aeb23948017f3

#### Fixed

- **合同类型选择：** 修复了选择完合同,切换页面或点击上传复原的问题。

### [Version 1.0.5_0821] - 2024-08-21

### commit:6bdd9be1e9df5f4ae716c375f85796c91e5b63d0

#### Added

- **修改建议：** 修订意见和批注内容文字修改, 并且修改建议高亮显示。

### [Version 1.0.5_0821] - 2024-08-21

### commit:25c6f782d2c9b48aadb6f721e40a286a02e247ad

#### Added

- **主体审查：** 主体审查功能前后端联调完成。

### commit:02811e691d91532a02188cf0799ce350574c00a8

### [Version 1.0.5_0821] - 2024-08-21

### commit:f771d588ee97f86d65504ff112d8ca60490d87c0

#### Added

- **主体审查：** 完成了主体审查的前端部分。

### [Version 1.0.5_0816] - 2024-08-19

### commit:02811e691d91532a02188cf0799ce350574c00a8

#### Fixed

- **对1.0.5版本的改动回退：** 回退了新的首页修改。
- **1.0.4版本首页新增立场选择：** 在上传合同上方新增合同立场选择。

### [Version 1.0.5_0816] - 2024-08-16

### commit:1b04d073a99b708cf9dcae16a222daa4f16c7319

#### Fixed

- **批注内容及修订意见：** 批注内容和修订意见写反了。
- **历史记录滑动删除closeAll报错：** 添加条件判断, 页面隐藏且有实例时执行closeAll。
- **双重水印：** 将累加在一起的双重水印交错显示。

### [Version 1.0.5_0816] - 2024-08-16

### commit:9abfee08b601fc040f0afbfad00f6504cc970863

#### Fixed

- **登录文案：** 修改了登录界面的文案提示。
- **历史记录滑动删除：** 历史记录界面滑动删除切换页面后不还原的问题修复。

### [Version 1.0.4] - 2024-08-14

### commit:672c13a377df2b6e1af03a94c119be58035b1e39

#### Fixed

- **双重水印覆盖原文：** 分享后未登录的审查结果,水印覆盖了原文。
- **上传失败后进度条还在继续：** 请求失败后没有处理进度条的判断。

### [Version 1.0.4] - 2024-08-14

### commit:edf4ad144a78c28a557b751a680df4bfea03c381

#### Fixed

- **合同审查中点击取消,报错为文件解析异常：** 后端返回信息处理,单独进行报错显示。

使用插件前需要安装如下依赖

```bash
npm i classnames unified hast-util-sanitize rehype-raw rehype-sanitize rehype-stringify remark-breaks remark-gemoji remark-gfm remark-parse remark-rehype unist-util-visit rehype-prism-plus
```

```json
{
  "classnames": "^2.3.2",
  "hast-util-sanitize": "^5.0.1",
  "rehype-prism-plus": "^1.6.3",
  "rehype-raw": "^7.0.0",
  "rehype-sanitize": "^6.0.0",
  "rehype-stringify": "^10.0.0",
  "remark-breaks": "^4.0.0",
  "remark-gemoji": "^8.0.0",
  "remark-gfm": "^4.0.0",
  "remark-parse": "^11.0.0",
  "remark-rehype": "^11.0.0",
  "unified": "^11.0.4",
  "unist-util-visit": "^5.0.0"
}
```

由于小程序不支持dom操作，接下来需要配置 vite.config.ts 将 decode-named-character-reference 解析到无 dom 环境的版本

```ts
import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  resolve: {
    alias: {
      "decode-named-character-reference":
        "node_modules/decode-named-character-reference/index.js",
    },
  },
});
```

### 小程序示例

```vue
<template>
  <view>
    <markdown-viewer :node="node" />
  </view>
</template>

<script lang="ts" setup>
import MarkdownViewer from "@/components/markdown-viewer/markdown-viewer.vue";
import { articleStrategy, toHast } from "@/markdown";
import { useHast } from "@/hooks";

const md = "markdown 内容";
const { node, setChunkHast } = useHast();

const hast = toHast(md, articleStrategy);
node.value = hast;
// 小程序 setData 方法内容过大会有性能问题，这时候可以使用 setChunkHast
// setChunkHast(hast);
</script>
```

### h5示例

```vue
<template>
  <view>
    <view v-html="html" />
  </view>
</template>

<script lang="ts" setup>
import { articleStrategy, getProcessor } from "@/markdown";

const md = "markdown 内容";

const html = getProcessor(articleStrategy)
  .processSync(md)
  .toString()
  .toString();
</script>
```

> h5 需要单独引入css
