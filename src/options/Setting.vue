<script setup>
import { onMounted, ref } from 'vue'
import {
  useMessage,
  NInputGroup,
  NInput,
  NButton,
  NDynamicInput,
  NCard
} from 'naive-ui'
import { Salt, HostMap } from '../utils'

const message = useMessage()

const hosts = ref([{
  key: '',
  value: ''
}])
const salt = ref('')
const hasSysSalt = ref(false)

async function saveSalt () {
  try {
    if(salt.value !== '') {
      await Salt.save(salt.value)
      message.success('salt保存成功')
      hasSysSalt.value = true
    } else {
      await Salt.remove()
      message.warning('salt清除成功')
      hasSysSalt.value = false
    }
  }catch(e){
    message.error('salt保存失败')
  }
}
async function saveHostMap () {
  const data = {}
  hosts.value.forEach(({ key, value }) => {
    data[key] = value
  })
  try {
    await HostMap.save(data)
    message.success('保存成功')
  }catch(e){
    message.error('保存失败')
  }
}

onMounted(async () => {
  hasSysSalt.value = await Salt.get()

  const storeData = await HostMap.get()
  const data = []
  for(const key in storeData){
    data.push({
      key,
      value: storeData[key]
    })
  }
  if (data.length) {
    hosts.value = data
  }
})
</script>

<template>
  <n-card>
    <n-input-group>
      <n-input type="password" v-model:value="salt" placeholder="salt" :style="{'min-width': '380px'}"/>
      <n-button attr-type="submit" @click="saveSalt">
        {{ hasSysSalt? '保存' : '设置'}}
      </n-button>
    </n-input-group>
  </n-card>
  <n-card style="margin-top:20px">
    <n-dynamic-input
      v-model:value="hosts"
      preset="pair"
      size="small"
      key-placeholder="origin host"
      value-placeholder="map host"
    />
    <div style="margin-top: 10px;text-align: right;">
      <n-button @click="saveHostMap">保存</n-button>
    </div>
  </n-card>
</template>