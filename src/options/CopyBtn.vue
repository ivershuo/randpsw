<template>
  <n-tooltip :show="copied" :placement="placement">
    <template #trigger>
      <n-button @click="copy" ref="btn" v-bind="$attrs">
        <slot></slot>
      </n-button>
    </template>
    <span>Copied!</span>
  </n-tooltip>
  <textarea ref="textarea" style="position: absolute;top: -999px;left: -9999px;"></textarea>
</template>
<script setup>
import { ref } from 'vue'
import { NTooltip, NButton, useMessage } from 'naive-ui'

const props = defineProps(['placement', 'text'])
const message = useMessage()

const copied = ref(false)
const textarea = ref(null)
const btn = ref(null)

function copy(){
  textarea.value.value = props.text
  textarea.value.focus()
  textarea.value.select()
  try {
    document.execCommand('copy')
    copied.value = true
    setTimeout(()=>{
      copied.value = false
    }, 1000)
  }catch(e){
    message.error('拷贝失败，请手动复制')
  }
}
</script>

<script>
export default {
  inheritAttrs: false
}
</script>