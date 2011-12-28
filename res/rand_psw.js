var salt = '';

function pswEl(){
    var pswElQuery = document.querySelectorAll('input[type="password"]');
    if(pswElQuery.length < 1){
        return pswEl.length;
    }
    return pswElQuery;
}

function rand_psw(){
    var domain = window.location.hostname.match(/\w+\.\w+$|\w+$|(\d{1,3}\.?){4}$/)[0].toLowerCase();
    var pswEl = document.querySelectorAll('input[type="password"]');
    function pswSec(v){
        var l = Math.min(v.length, 32),
            start = Math.min((v.match(/\d/)||0)[0]|0, 32 - l);            
        var randPsw = hex_md5(v + domain + salt).substr(start, l);
        var pswArr = v.match(/./g),
            randPswArr = Array.prototype.slice.call(randPsw, 0);
        for(var i = 0; i < l; i++){
            if(pswArr[i].search(/[A-Z]/) === 0 && randPswArr[i].search(/[A-Za-z]/) === 0){
                randPswArr[i] = randPswArr[i].toUpperCase();
            } else if(pswArr[i].search(/[^A-Za-z0-9]/) === 0){
                randPswArr[i] = pswArr[i];
            }
        }
        return randPswArr.join('');
    }
    var pswElArr = Array.prototype.slice.call(pswEl, 0);
    pswElArr.forEach(function(psw){        
        psw.addEventListener('keyup', function(){
            psw.setAttribute('data-didmd5', '');
            chrome.extension.sendRequest({rand : false});
        }, false);
        psw.addEventListener('dblclick', function(){
            if(!psw.getAttribute('data-didmd5') && psw.value){
                psw.value = pswSec(psw.value);
                psw.style.color = salt ? '#458b00' : '#eec900';
                psw.setAttribute('data-didmd5', 'true');
                chrome.extension.sendRequest({rand : true});
            }
        }, false);
    });
}

chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse){
        var ret = {};
        /*加载content js 资源*/
        if(request.jsloaded){
            if(request.jsloaded == 'rand_psw' && pswEl()){
                ret = {hasPsw : true};
            } else {                
                rand_psw();
            }
        }
        /*更新 salt*/
        if(request.salt){
            salt = request.salt;
        }
        sendResponse(ret);
    }
);