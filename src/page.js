import './page.css'

let showPassword = false

const passwordFieldStates = new WeakMap()

function requestRandpsw(psw, cb) {
  chrome.runtime.sendMessage({act: 'genpsw', data: {psw}}, ret => {
    if(ret){
      cb(ret)
    }
  })
}
function genpsw(event) {
  if (event.target.tagName === 'INPUT' && event.target.type === 'password') {
    const passwordField = event.target
    if (passwordField.value) {
      if (!passwordFieldStates.get(passwordField)) {
        // 执行您的自定义操作
        requestRandpsw(passwordField.value, ({psw, hasSalt})=>{
          passwordField.value = psw
          passwordField.setAttribute('data-randpsw', hasSalt? 1 : 0)
          if (hasSalt){
            passwordField.classList.add('pswGened')
          } else {
            passwordField.classList.add('pswGenedNosalt')
          }
        })

        // 标记该密码框已被处理
        passwordFieldStates.set(passwordField, true)
        // 添加输入事件监听器来重置状态
        passwordField.addEventListener('input', function inputHandler() {
          if (!passwordField.value) {
            passwordFieldStates.set(passwordField, false)
            passwordField.classList.remove('pswGened', 'pswGenedNosalt')
            passwordField.removeEventListener('input', inputHandler)
          }
        })
      }
    }
  }
}

function toggleShowPassword() {
  showPassword =!showPassword
  document.querySelectorAll('input[data-randpsw]').forEach(el => {
    el.type = showPassword? 'text' : 'password'
  })
}

document.addEventListener('dblclick', genpsw)

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const {act, data} = request
  switch (act) {
    case 'toggle-psw-show':
      toggleShowPassword()
      sendResponse(showPassword)
      break
    default:
      console.log('未知的消息')
  }
})