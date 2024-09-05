import md5 from 'crypto-js/md5'

// 获取顶级域名（非严格形式的顶级域名，只是为了hash需要）
export function getDomain(uri){
  if (!uri) return ''
  const domainRegex = /[\w\-]+\.\w+$|\w+$|(\d{1,3}\.){3}\d{1,3}$/
  try {
    const fullUri = uri.startsWith('http') ? uri : `http://${uri}`
    const url = new URL(fullUri)
    const match = url.hostname.toLowerCase().match(domainRegex)
    return match ? match[0].toLowerCase() : ''
  } catch (e) {
    return ''
  }
}

export const Salt = {
  async save(val){
    return chrome.storage.sync.set({
      salt: md5(val).toString(),
    })
  },
  async get(){
    const result = await chrome.storage.sync.get('salt')
    return result?.salt
  },
  async remove(){
    return chrome.storage.sync.remove('salt')
  }
}

export const HostMap = (()=>{
  const hostMapStorageKey = 'domainmap'
  async function getData(){
    const result = await chrome.storage.local.get(hostMapStorageKey)
    return result?.[hostMapStorageKey] || {}
  }

  return {
    async save(data){
      const clearData = {}
      for (const key in data) {
        clearData[getDomain(key)] = getDomain(data[key])
      }
      return chrome.storage.local.set({
        [hostMapStorageKey]: clearData,
       })
    },
    async add(host, map2host){
      const data = await getData()
      data[getDomain(host)] = getDomain(map2host)
      return chrome.storage.local.set({
        [hostMapStorageKey]: data,
      })
    },
    async get(host){
      const data = await getData()
      if(host){
        return data[getDomain(host)] || getDomain(host)
      }
      return data
    },
    async remove(host){
      const data = await getData()
      delete data[getDomain(host)]
      return chrome.storage.local.set({
        [hostMapStorageKey]: data,
      })
    }
  }
})()