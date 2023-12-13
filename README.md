# liquid-ui

## 介绍

基于 vue3+ts+Element-plus 封装组件

## npm 方式安装使用

```shell
npm i @wangzhipeng/liquid-ui
```

## 全局注册使用

```js
// 前提条件：使用项目必须全局注册 Element-plus组件库
// 在main.js中按下引入
import liquidUI from '@wangzhipeng/liquid-ui'
import '@wangzhipeng/liquid-ui/lib/style.css'
Vue.use(liquidUI)
```

## 按需引入

```js
// 在main.js中按下引入
import '@wangzhipeng/liquid-ui/lib/style.css'
// 单个.vue文件引入
<script setup lang="ts">
  import { LDialog } from "@wangzhipeng/liquid-ui"
</script>
```


## 安装依赖


```shell
// 注意: 本地环境版本最好安装 [Node.js 16.x+](https://nodejs.org/en)、[pnpm 7.x+](https://github.com/pnpm/pnpm/)
// vite版本升级到4+

npm install -g pnpm

pnpm install

```


## 本地运行 vuepress 中组件文档

```shell
// docs项目(文档demo示例)基于vue3+vite项目
npm run docs:dev

```


## liquid-ui Volar 组件类型提示

```js
// 需要在使用的项目的tsconfig.json文件中添加以下
compilerOptions：{
  "types": [
      "@wangzhipeng/liquid-ui/components.d.ts",
    ],
}

```