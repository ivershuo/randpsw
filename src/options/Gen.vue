<script setup>
import { ref } from 'vue'
import {
  NForm,
  NFormItem,
  NInput,
  NButton,
  NCheckbox,
  NInputGroup,
  NFlex
} from 'naive-ui'
import CopyBtn from './CopyBtn.vue'
import randpsw from '../randpsw'
import { Salt, HostMap } from '../utils'

const genForm = ref(null)
const url = ref('')
const psw = ref('')
const isv1 = ref(false)
const ret = ref('')

async function genPsw(){
  const salt = await Salt.get()
  const host = await HostMap.get(url.value)
  ret.value = randpsw(psw.value, host, salt, isv1.value)
}

</script>

<template>
<n-form
  ref="genForm"
  label-placement="left"
  label-width="auto"
>
  <n-form-item label="URL" path="url">
    <n-input v-model:value="url" placeholder="URL" />
  </n-form-item>
  <n-form-item label="PSW" path="psw">
    <n-input type="password" v-model:value="psw" placeholder="PSW" />
  </n-form-item>
  <!-- <n-form-item label="SALT" path="salt">
    <n-input type="password" v-model:value="salt" placeholder="SALT" />
  </n-form-item> -->
  <n-form-item label="RET" path="ret">
    <n-input-group>
      <n-input :value="ret" placeholder="RET" />
      <copy-btn :text="ret">复制</copy-btn>
    </n-input-group>
  </n-form-item>
  <n-form-item label=" ">
    <n-button attr-type="submit" @click="genPsw">
      生成
    </n-button>
    <template #feedback>
      <n-flex justify="end">
        <n-checkbox v-model:checked="isv1"> is v1?</n-checkbox>
      </n-flex>
    </template>
  </n-form-item>
</n-form>
</template>

<style scoped>
</style>