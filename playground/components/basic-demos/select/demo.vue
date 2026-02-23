<script setup lang="ts">
import { shallowRef } from 'vue'

const options = [
  { value: 'jack', label: 'Jack' },
  { value: 'lucy', label: 'Lucy' },
  { value: 'Yiminghe', label: 'yiminghe' },
  { value: 'disabled', label: 'Disabled', disabled: true },
]
const value1 = shallowRef('lucy')
const value2 = shallowRef('lucy')
</script>

<template>
  <a-space wrap>
    <div>
      {{ value1 }}
    </div>
    <a-select v-model:value="value1" style="width: 120px" :options="options" allow-clear />
    <a-select v-model:value="value2" style="width: 120px" disabled :options="[{ value: 'lucy', label: 'lucy' }]" />
  </a-space>
</template>
