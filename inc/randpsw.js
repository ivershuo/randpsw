(function(ns){
	'use strict';

	var aElement = document.createElement('a');

	function getDomain(uri){
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
	};

	/**
	 * 生成随机密码
	 * @param  {[type]} value 初始密码值
	 * @param  {[type]} uri   密码使用的网页
	 * @param  {[type]} salt  salt值
	 */
	function randpsw(value, uri, salt){
		salt = salt || '';
		value = value.toString();
		
		/* 这里算法有问题，因为32位长16进制转10进制的时候js中会科学计数法导致后续转36进制是有问题的，
	 	* 但是为了兼容之前版本只能先这样了
	 	*/
		var randPsw = parseInt(hex_md5(value + getDomain(uri) + salt), 16).toString(36),
            randPswLength = randPsw.length;
        var l = Math.min(value.length, randPswLength),
            start = Math.min((value.match(/\d/)||0)[0]|0, randPswLength - l);
        randPsw = randPsw.substr(start, l);
        var pswArr = value.match(/./g),
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

	ns.randpsw = randpsw;
})(this);