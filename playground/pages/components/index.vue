<script setup lang="ts">
const components = [
  'affix',
  'alert',
  'anchor',
  'app',
  'auto-complete',
  'avatar',
  'badge',
  'border-beam',
  'breadcrumb',
  'button',
  'calendar',
  'card',
  'carousel',
  'cascader',
  'checkbox',
  'collapse',
  'color-picker',
  'config-provider',
  'date-picker',
  'descriptions',
  'divider',
  'drawer',
  'dropdown',
  'empty',
  'flex',
  'float-button',
  'form',
  'grid',
  'icon',
  'image',
  'input',
  'input-number',
  'layout',
  'masonry',
  'mentions',
  'menu',
  'message',
  'modal',
  'notification',
  'pagination',
  'popconfirm',
  'popover',
  'progress',
  'qr-code',
  'radio',
  'rate',
  'result',
  'segmented',
  'select',
  'skeleton',
  'slider',
  'space',
  'spin',
  'splitter',
  'statistic',
  'steps',
  'switch',
  'table',
  'tabs',
  'tag',
  'time-picker',
  'timeline',
  'tooltip',
  'tour',
  'transfer',
  'tree',
  'tree-select',
  'typography',
  'upload',
  'watermark',
] as const
</script>

<template>
  <a-space
    direction="vertical"
    :size="16"
    style="width: 100%;"
  >
    <a-alert
      message="组件 Demo 导航"
      description="每个组件单独页面，优先使用上游 playground 的 demo/basic.vue，方便逐页定位 hydration 问题。"
      type="info"
      show-icon
    />

    <div class="link-grid">
      <NuxtLink
        v-for="name in components"
        :key="name"
        :to="`/components/${name}`"
      >
        <a-card
          hoverable
          size="small"
        >
          <a-typography-text>{{ name }}</a-typography-text>
        </a-card>
      </NuxtLink>
    </div>
  </a-space>
</template>

<style scoped>
.link-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 10px;
}

.link-grid a {
  text-decoration: none;
}
</style>
