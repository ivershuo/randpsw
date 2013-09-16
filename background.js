(function(){
	'use strict';

	var runtime = chrome.runtime,
		salt = localStorage.salt || '',
		pageAction = chrome.pageAction;

	function setIconStatus(tabId, lock){
	    var icon = lock ? 'lock' : 'open';
	    pageAction.setIcon({tabId: tabId, path : 'imgs/' + icon + '.png'});
	    pageAction.show(tabId);
	}

	var actions = {
		getPasswd : function(value, url, sender, cb){
			var passwd = randpsw(value, url, salt);
			cb({
				passwd  : passwd,
				hasSalt : !!salt
			});
		},
		setIcon : function(lock, sender, cb){
			setIconStatus(sender.tab.id, lock);
		}
	}

	/*监听给插件的消息*/
	runtime.onMessage.addListener(function(data, sender, cb){
		if(data && data.action && actions[data.action]){
			var params = (data.params || []).concat(sender, cb);
			actions[data.action].apply(actions, params);
		}
	});

	/*监听salt值改变*/
	window.addEventListener("storage", function(e){
	    if(e.key == 'salt'){
	    	salt = localStorage.salt;
	    }
	}, false);
})();