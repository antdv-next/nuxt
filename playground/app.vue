<template>
  <a-config-provider :theme="{ zeroRuntime: true }">
    Nuxt module playground!
    <a-button type="primary">
      测试
    </a-button>
    <a-alert
      message="Antdv Next Alert 测试"
      type="success"
      show-icon
    />
    <a-select style="width: 200px;" />
    <a-space
      direction="vertical"
      :size="16"
    >
      <a-space
        wrap
        :size="16"
      >
        <a-avatar :size="64">
          <template #icon>
            <UserOutlined />
          </template>
        </a-avatar>
        <a-avatar size="large">
          <template #icon>
            <UserOutlined />
          </template>
        </a-avatar>
        <a-avatar>
          <template #icon>
            <UserOutlined />
          </template>
        </a-avatar>
        <a-avatar size="small">
          <template #icon>
            <UserOutlined />
          </template>
        </a-avatar>
        <a-avatar :size="14">
          <template #icon>
            <UserOutlined />
          </template>
        </a-avatar>
      </a-space>
      <a-space
        wrap
        :size="16"
      >
        <a-avatar
          shape="square"
          :size="64"
        >
          <template #icon>
            <UserOutlined />
          </template>
        </a-avatar>
        <a-avatar
          shape="square"
          size="large"
        >
          <template #icon>
            <UserOutlined />
          </template>
        </a-avatar>
        <a-avatar shape="square">
          <template #icon>
            <UserOutlined />
          </template>
        </a-avatar>
        <a-avatar
          shape="square"
          size="small"
        >
          <template #icon>
            <UserOutlined />
          </template>
        </a-avatar>
        <a-avatar
          shape="square"
          :size="14"
        >
          <template #icon>
            <UserOutlined />
          </template>
        </a-avatar>
      </a-space>
    </a-space>
    <TableTest />
    <a-qrcode
      error-level="H"
      value="'https://www.antdv-next.com"
      icon="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
    />
  </a-config-provider>
</template>
