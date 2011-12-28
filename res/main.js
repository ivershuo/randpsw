/**
* rand psw 主文件
**/
localStorage.salt = localStorage.salt || '';
var tabsId = [];

/*设置状态*/
function _setStatus(tabId, lock){
    var icon = lock ? 'lock' : 'open';
    chrome.pageAction.setIcon({tabId: tabId, path : 'res/' + icon + '.png'});
}

chrome.tabs.onUpdated.addListener(function(tabId, tabObj, tabInfo){
    if(tabInfo.status != 'complete' || tabInfo.url.substr(0, 4) != 'http'){
        return;
    }   

    /*加载页面脚本*/
    function loadPswJs(jsFileName, func){
        chrome.tabs.executeScript(null,
            {file : 'res/' + jsFileName + '.js', allFrames : true},
            function(){                
                chrome.tabs.sendRequest(tabId, {jsloaded : jsFileName, salt : localStorage.salt}, func);
            }
        );
    }

    loadPswJs('rand_psw', function(response){
        if(response.hasPsw){
            tabsId.push(tabId);
            chrome.pageAction.show(tabId);
            loadPswJs('md5', function(response){
            });
        }
    });    
});

/*监听salt值改变*/
window.addEventListener("storage", function(e){
    if(e.key == 'salt'){
        for(i in tabsId){
            chrome.tabs.sendRequest(tabsId[i], {salt : localStorage.salt});
        }
    }
}, false);

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {    
    _setStatus(sender.tab.id, request.rand);
});