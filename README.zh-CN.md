<p align="center">
  <img width="300px" src="https://www.antdv-next.com/antdv-next.svg">
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/@antdv-next/nuxt">
    <img src="https://img.shields.io/npm/v/%40antdv-next%2Fnuxt.svg">
  </a>
  <a href="https://npmcharts.com/compare/@antdv-next/nuxt?minimal=true">
    <img src="https://img.shields.io/npm/dm/%40antdv-next%2Fnuxt.svg">
  </a>
</p>

# Antdv Next Nuxt

> [Antdv Next](https://www.antdv-next.com) 的 [Nuxt](https://nuxt.com) 模块

[English](./README.md)

## 特性

- 自动将 `antdv-next` 组件注册为全局 Nuxt 组件。
- 可选自动注册 `@antdv-next/icons` 图标组件。
- 支持组件前缀（默认 `A`），例如 `AButton`。
- 内置 SSR 场景下的 CSS-in-JS 上下文与服务端样式提取。
- 使用 Vite Builder 时自动注入 `vite-plugin-dayjs`。

## 版本要求

- Nuxt >= 4.0.0
- Vue >= 3.5.0
- antdv-next >= 1.0.4
- @antdv-next/icons >= 1.0.1

## 安装

```bash
npx nuxi@latest module add @antdv-next/nuxt
# 或
pnpm add -D @antdv-next/nuxt antdv-next @antdv-next/icons
```

## 配置

```ts
export default defineNuxtConfig({
  modules: ['@antdv-next/nuxt'],
  antd: {
    icon: true,
  },
})
```

`@antdv-next/nuxt` 在 `nuxt.config` 中的配置键是 `antd`。

## 使用

```vue
<template>
  <a-button type="primary">Primary</a-button>
  <HomeOutlined />
</template>
```

如果保持默认前缀，组件会注册成 `A*`，例如 `AButton`、`ATable`、`AQrcode`。

## 样式

基础重置样式：

```ts
export default defineNuxtConfig({
  css: ['antdv-next/dist/reset.css'],
})
```

如果使用 zero-runtime 主题模式（推荐模式），还需要引入：

```ts
export default defineNuxtConfig({
  css: [
    'antdv-next/dist/reset.css',
    'antdv-next/dist/antd.css',
  ],
})
```

> [!WARNING]
> 如果开启了 `nuxt devtools`，开发模式下的样式加载可能会变慢。  
> 如果你遇到样式加载过慢或页面暂时无法正常点击的情况，请先尝试关闭 `nuxt devtools`，或等待 `console` 中相关加载完成后再操作。
>
> 该问题不会影响正常预编译开发流程，也不会影响生产环境。

## 选项

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `icon` | `boolean` | `false` | 是否自动注册 `@antdv-next/icons` 图标组件。 |
| `prefix` | `string` | `'A'` | 自动注册组件的前缀。 |
| `include` | `ComponentName[]` | `undefined` | 仅注册列表中的组件。优先级高于 `exclude`。 |
| `exclude` | `ComponentName[]` | `undefined` | 在未设置 `include` 时，排除列表中的组件。 |
| `includeIcons` | `IconName[]` | `undefined` | 仅注册列表中的图标。优先级高于 `excludeIcons`。 |
| `excludeIcons` | `IconName[]` | `undefined` | 在未设置 `includeIcons` 时，排除列表中的图标。 |

说明：

- `ComponentName` 可选值见 [src/runtime/components.ts](./src/runtime/components.ts)。
- `IconName` 可选值见 [src/runtime/icons.ts](./src/runtime/icons.ts)。
- `includeIcons` 和 `excludeIcons` 仅在 `icon` 开启时生效。

## 本地开发

```bash
pnpm install
pnpm dev:prepare
pnpm dev
pnpm dev:build
pnpm lint
pnpm test
```
