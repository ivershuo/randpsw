(function(){
	'use strict';

	function $(v){
        return typeof(v) == 'string' ? document.getElementById(v) : v;
    }

    var mDomain = $('domain'),
    	mBindto = $('bindto');
	
	var messageSender = function(actions, params, cb){
    	chrome.runtime.sendMessage({
    		action : actions,
    		params : params
    	}, function(response) {
			cb && cb(response);
		});
    };

    var domainMapTmpl = '<li><span class="unmap" data-domain="$1">删</span><strong>$1</strong> => <span>$2</span></li>',
    	domainListEl  = $('domainmap-list');
    var fillDomainMap = function(domainData){
    	if(!domainData){
    		return;
    	}
    	var html = [];
    	for(var domain in domainData){
    		html.unshift(domainMapTmpl.replace(/\$1/g, domain).replace('$2', domainData[domain]));
    	}
    	domainListEl.innerHTML = html.join('');
    }

	var eventMap = {
		'#save:click' : function(){
			messageSender('saveSalt', [$('salt').value]);
		},
		'#query:click' : function(){
			messageSender('getPasswd', [$('psw').value, $('url').value], function(response) {
				$('randpsw').value = response.passwd;
			});
		},
		'#map:click' : function(){
			messageSender('saveDomainMap', [mDomain.value, mBindto.value]);
		},
		'#domainmap-list:click' : function(e){
			var target = e.target,
				isDeleteEl = Array.prototype.indexOf.call(target.classList, 'unmap') > -1;
			if(isDeleteEl){
				messageSender('deleteDomainMap', [target.dataset.domain]);
			}	
		}
	};

	for(var ele in eventMap){
		var func = eventMap[ele],
			d    = ele.split(':'),
			el   = document.querySelector(d[0]),
			evt  = d[1];
		el.addEventListener(evt, func);
	}

	chrome.runtime.onMessage.addListener(function(data, sender, cb){
		if(data.action && data.action == 'domainMapUpdated'){
			fillDomainMap(data.data);
		}
	});

	messageSender('getDomainMap', [], function(data){
		fillDomainMap(data);
	});	
})();