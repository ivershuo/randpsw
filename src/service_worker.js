import randpsw from './randpsw'
import { Salt, HostMap } from './utils'
import iconLock from './imgs/lock.png'
import iconOpen from './imgs/open.png'

chrome.action.onClicked.addListener(tab =>{
  const {id, active, status} = tab
  if (active && status === 'complete') {
    chrome.tabs.sendMessage(id, {act: 'toggle-psw-show'}, {}, show => {
      chrome.action.setIcon({path: show? iconOpen : iconLock, tabId: id})
    })
  }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse)=> {
  const { act, data } = request
  if(act === 'genpsw'){
    const { origin, tab } = sender
    Promise.all([Salt.get(), HostMap.get(origin)]).then((res)=> {
      const [salt, host] = res
      const psw = randpsw(data.psw, host, salt)
      sendResponse({ psw, hasSalt: !!salt })
    }).catch((e)=> {
      console.log(e)
    })
  }
  return true
})