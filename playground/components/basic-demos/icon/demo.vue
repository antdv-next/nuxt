<script setup lang="ts">
import {
  HomeOutlined,
  SmileOutlined,
  LoadingOutlined,
  SyncOutlined,
  HeartFilled,
} from '@antdv-next/icons'
</script>

<template>
  <a-space wrap>
    <HomeOutlined />
    <SmileOutlined />
    <SmileOutlined :rotate="180" />
    <LoadingOutlined />
    <SettingFilled />
    <SyncOutlined spin />
    <HeartFilled />
  </a-space>
</template>
