<script setup>
import { ref, computed } from 'vue'
import { 
  NConfigProvider,
  NMessageProvider,
  darkTheme,
  NCard,
  NLayout,
  NSpace,
  NCollapse,
  NCollapseItem
} from 'naive-ui'
import GenForm from './Gen.vue'
import Setting from './Setting.vue'

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
  <n-layout embedded content-style="min-height:100vh;padding: 20px;min-width:600px">
    <n-space vertical :size="20">
      <n-card>
        <genForm />
      </n-card>
      <n-card>
        <n-collapse arrow-placement="right">
          <n-collapse-item title="设置">
            <Setting />
          </n-collapse-item>
        </n-collapse>
      </n-card>
    </n-space>
  </n-layout>
</n-message-provider>
</n-config-provider>
</template>

<style scoped>
</style>