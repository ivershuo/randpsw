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
import md5 from 'crypto-js/md5'
import CopyBtn from '../src/options/CopyBtn.vue'
import randpsw from '../src/randpsw'
import { getDomain } from '../src/utils'

const genForm = ref(null)
const url = ref('')
const psw = ref('')
const salt = ref('')
const isv1 = ref(false)
const ret = ref('')

async function genPsw(){
  const md5Salt = md5(salt.value).toString()
  ret.value = randpsw(psw.value, getDomain(url.value), md5Salt, isv1.value)
}
</script>

<template>
<n-form
  ref="genForm"
  label-placement="left"
  label-width="auto"
>
  <n-form-item label="URL" path="url">
    <n-input v-model:value="url" placeholder="URL" clearable />
  </n-form-item>
  <n-form-item label="PSW" path="psw">
    <n-input type="password" v-model:value="psw" placeholder="PSW" show-password-on="click" clearable />
  </n-form-item>
  <n-form-item label="SALT" path="salt">
    <n-input type="password" v-model:value="salt" placeholder="SALT" show-password-on="click" clearable />
  </n-form-item>
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