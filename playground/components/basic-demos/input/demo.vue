<script setup lang="ts">
import { ref } from 'vue'

const value = ref()
</script>

<template>
  <a-input v-model:value="value" placeholder="Basic usage" allow-clear />
</template>
