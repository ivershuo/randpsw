import md5 from 'crypto-js/md5'

export default function (val, domain, salt = '', v1ver=false) {
  const input = val.toString() + domain + salt
  const md5Str = md5(input).toString()
  let randPsw = BigInt(`0x${md5Str}`).toString(36)
	// v1版本未考虑大数情况下的bug，为了兼容
	if (v1ver) {
		randPsw = parseInt(md5Str, 16).toString(36)
	}

  const l = Math.min(val.length, randPsw.length);
  const start = Math.min(parseInt(val.match(/\d/)?.[0] ?? '0'), randPsw.length - l)
  
  return Array.from(val.slice(0, l)).reduce((acc, char, i) => {
    const randChar = randPsw[start + i];
    if (/[A-Z]/.test(char) && /[a-zA-Z]/.test(randChar)) {
      return acc + randChar.toUpperCase()
    } else if (/[^a-zA-Z0-9]/.test(char)) {
      return acc + char
    } else {
      return acc + randChar
    }
  }, '')
}