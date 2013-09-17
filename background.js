(function(){
	'use strict';

	var LOCAL_SALT_KEY = 'salt',
		LOCAL_DOMAINMAP_KEY = 'domainmap';

	var runtime = chrome.runtime,
		pageAction = chrome.pageAction;

	var salt,domainMap;

	var Utils = ({
		_getDomain : function(){
			var aElement = document.createElement('a');
			return function(uri){
				if(!uri){
					return '';
				}
				if(!/^\w{3,5}\:\/\//.test(uri)){
					uri = 'http://' + uri;
				}
				aElement.href = uri;
				var domain;
				try{
					var domain = aElement.hostname.match(/\w+\.\w+$|\w+$|(\d{1,3}\.){3}\d{1,3}$/)[0].toLowerCase();
				}catch(e){
					domain = '';
				}
				return domain;
			}		
		},
		init : function(){
			this.getDomain = this._getDomain();
			delete this.init;
			return this;
		}
	}).init();

	var setIconStatus = function(tabId, lock){
		var icon = lock ? 'lock' : 'open';
	    pageAction.setIcon({tabId: tabId, path : 'imgs/' + icon + '.png'});
	    pageAction.show(tabId);
	}

	var localData = {
		set : function(k, v){
			v = typeof v == 'string' ? v : JSON.stringify(v);
			localStorage.setItem(k, v);
		},
		get : function(k){
			var v = localStorage.getItem(k) || '';
			return /^\{/.test(v) ? JSON.parse(v) : v;
		}
	};

	var actions = {
		getPasswd : function(value, url, sender, cb){
			var domain = Utils.getDomain(url);
			domain = domainMap[domain] || domain;
			var passwd = randpsw(value, domain, salt);
			cb({
				passwd  : passwd,
				hasSalt : !!salt
			});
		},
		setIcon : function(lock, sender, cb){
			setIconStatus(sender.tab.id, lock);
		},
		saveSalt : function(salt, sender, cb){
			salt = hex_md5(salt);
			localData.set(LOCAL_SALT_KEY, salt);		
		},
		updateDomainMap : function(){			
			localData.set(LOCAL_DOMAINMAP_KEY, domainMap);
			chrome.runtime.sendMessage({
				action : 'domainMapUpdated',
				data   : domainMap
			});
		},
		saveDomainMap : function(domain, bintoDomain, sender, cb){
			if(!domain || !bintoDomain){
				return;
			}
			domain      = Utils.getDomain(domain);
			bintoDomain = Utils.getDomain(bintoDomain);
			if(domainMap[domain]){
				return;
			}
			domainMap[domain] = bintoDomain;
			this.updateDomainMap();
		},
		deleteDomainMap : function(domain){
			if(!domain || !domainMap[domain]){
				return;
			}
			delete domainMap[domain];
			this.updateDomainMap();
		},
		getDomainMap : function(sender, cb){
			cb(domainMap);
		}
	};

	var run = function(){
		salt = localData.get(LOCAL_SALT_KEY);
		domainMap = localData.get(LOCAL_DOMAINMAP_KEY) || {};

		/*监听给插件的消息*/
		runtime.onMessage.addListener(function(data, sender, cb){
			if(data && data.action && actions[data.action]){
				var params = (data.params || []).concat(sender, cb);
				actions[data.action].apply(actions, params);
			}
		});
	}
	run();
})();