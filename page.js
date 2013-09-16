(function(){
	'use strict';

	var DIDMD5_ATTR = 'didmd5';

	var runtime = chrome.runtime,
		url = location.href;

	function messageSender (action){
		var defer = when.defer(),
			params = Array.prototype.slice.call(arguments, 1);
		runtime.sendMessage({
			action : action, 
			params : params
		}, function(response) {
			defer.resolve(response);
		});
		return defer.promise;
	}

	function fillNewPsw(el, value, hasSalt){
		el.value = value;
		el.style.color = hasSalt ? '#458b00' : '#eec900';
		el.dataset[DIDMD5_ATTR] = 1;
	};

	function checkIsPswEl(el){
		if(el.nodeType == 1 
			&& el.tagName.toLowerCase() == 'input' 
			&& el.getAttribute('type') == 'password'
		){ return true; }
	}

	function checkHadToRand(el){
		if(checkIsPswEl(el) && el.value && !el.dataset[DIDMD5_ATTR]){
			return true;
		}
	}

	window.addEventListener('dblclick', function(e){
		var target = e.target;
		if(checkHadToRand(target)){
			messageSender('getPasswd', target.value, url).then(function(pswData){
				fillNewPsw(target, pswData.passwd, pswData.hasSalt);
				messageSender('setIcon', true);
			});
		}
	});

	window.addEventListener('click', function(e){
		var target = e.target;
		if(checkIsPswEl(target)){
			messageSender('setIcon', target.dataset[DIDMD5_ATTR]);
		}		 
	});

	window.addEventListener('input', function(e){
		var target = e.target;
		if(checkIsPswEl(target) && target.dataset[DIDMD5_ATTR]){
			target.dataset[DIDMD5_ATTR] = '';
			messageSender('setIcon', false);
		}
	});
})();