(function(){
	'use strict';

	function $(v){
        return typeof(v) == 'string' ? document.getElementById(v) : v;
    }

	function saveSalt(salt){
		localStorage.setItem('salt', hex_md5($('salt').value));
	}

	$('save').addEventListener('click', function(){
		saveSalt($('salt').value);
    });

    $('query').addEventListener('click', function(){
    	chrome.runtime.sendMessage({
    		action: "getPasswd",
    		params : [$('psw').value, $('url').value]
    	}, function(response) {
			$('randpsw').value = response.passwd;
		});
    });
})();