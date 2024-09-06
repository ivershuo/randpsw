<script setup>
import { computed } from 'vue'
import { 
  NConfigProvider,
  NMessageProvider,
  darkTheme,
  NCard,
  NLayout,
  NSpace
} from 'naive-ui'
import GenForm from './Gen.vue'

const themeOverrides = {
  common: {
    primaryColor: '#666',
    primaryColorHover: '#999',
    primaryColorPressed: '#666'
  },
}

const theme = computed(() => {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches? darkTheme: null;
})
</script>

<template>
<n-config-provider :theme="theme" :theme-overrides="themeOverrides">
  <n-message-provider>
  <n-layout embedded content-style="min-height:100vh;padding: 1vw">
    <n-card>
      <genForm />
    </n-card>
  </n-layout>
</n-message-provider>
</n-config-provider>
</template>

<style scoped>
</style>