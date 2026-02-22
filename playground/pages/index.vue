<template>
  <a-space
    direction="vertical"
    :size="16"
    style="width: 100%;"
  >
    <a-alert
      message="组件水合验证 Playground"
      description="已在 /components 页面实现每个组件一个最小 demo，便于直接观察 SSR 与 hydration 行为。"
      type="info"
      show-icon
    />

    <a-card title="入口">
      <a-space :size="12">
        <NuxtLink to="/components">
          <a-button type="primary">
            打开全部组件 Demo
          </a-button>
        </NuxtLink>
      </a-space>
    </a-card>
  </a-space>
</template>
