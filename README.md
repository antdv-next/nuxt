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

> [Antdv Next](https://www.antdv-next.com) module for [Nuxt](https://nuxt.com)

[中文文档](./README.zh-CN.md)

## Features

- Auto register `antdv-next` components as global Nuxt components.
- Optional auto register icons from `@antdv-next/icons`.
- Component prefix support (default: `A`), e.g. `AButton`.
- SSR-safe CSS-in-JS setup and style extraction on server render.
- Adds `vite-plugin-dayjs` automatically when using Vite builder.

## Version Requirements

- Nuxt >= 4.0.0
- Vue >= 3.5.0
- antdv-next >= 1.0.4
- @antdv-next/icons >= 1.0.1

## Installation

```bash
npx nuxi@latest module add @antdv-next/nuxt
# or
pnpm add -D @antdv-next/nuxt antdv-next @antdv-next/icons
```

## Configuration

```ts
export default defineNuxtConfig({
  modules: ['@antdv-next/nuxt'],
  antd: {
    icon: true,
  },
})
```

`@antdv-next/nuxt` uses `antd` as the config key.

## Usage

```vue
<template>
  <a-button type="primary">Primary</a-button>
  <HomeOutlined />
</template>
```

If you keep the default prefix, component names are registered as `A*` (for example `AButton`, `ATable`, `AQrcode`).

## Styles

For reset styles:

```ts
export default defineNuxtConfig({
  css: ['antdv-next/dist/reset.css'],
})
```

For zero-runtime theme mode (recommended), also include:

```ts
export default defineNuxtConfig({
  css: [
    'antdv-next/dist/reset.css',
    'antdv-next/dist/antd.css',
  ],
})
```

> [!WARNING]
> If `nuxt devtools` is enabled, style loading in development may become slower.  
> If you see slow style hydration or temporarily unclickable UI, try disabling `nuxt devtools`, or wait until related loading in the console is finished.
>
> This does not affect normal precompiled development flow or production builds.

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `icon` | `boolean` | `false` | Enable auto registration of icons from `@antdv-next/icons`. |
| `prefix` | `string` | `'A'` | Prefix for auto-registered components. |
| `include` | `ComponentName[]` | `undefined` | Only register listed components. Takes precedence over `exclude`. |
| `exclude` | `ComponentName[]` | `undefined` | Exclude listed components when `include` is not set. |
| `includeIcons` | `IconName[]` | `undefined` | Only register listed icons. Takes precedence over `excludeIcons`. |
| `excludeIcons` | `IconName[]` | `undefined` | Exclude listed icons when `includeIcons` is not set. |

Notes:

- `ComponentName` values come from [src/runtime/components.ts](./src/runtime/components.ts).
- `IconName` values come from [src/runtime/icons.ts](./src/runtime/icons.ts).
- `includeIcons` and `excludeIcons` are effective only when `icon` is enabled.

## Development

```bash
pnpm install
pnpm dev:prepare
pnpm dev
pnpm dev:build
pnpm lint
pnpm test
```
