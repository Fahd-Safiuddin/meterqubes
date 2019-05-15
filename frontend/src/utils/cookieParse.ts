const decode = decodeURIComponent
const pairSplitRegExp = /; */

const tryDecode = (str: string, decode: (str: string) => void) => {
  try {
    return decode(str)
  } catch (e) {
    return str
  }
}

export const cookieParse = (str: string, options?: any) => {
  if (typeof str !== 'string') {
    // throw new TypeError('argument str must be a string')
    return
  }

  const obj = {}
  const opt = options || {}
  const pairs = str.split(pairSplitRegExp)
  const dec = opt.decode || decode

  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i]
    let eq_idx = pair.indexOf('=')

    // set true for things that don't look like key=value
    let key: string
    let val: string
    if (eq_idx < 0) {
      key = pair.trim()
      val = 'true'
    } else {
      key = pair.substr(0, eq_idx).trim()
      val = pair.substr(++eq_idx, pair.length).trim()
    }

    // quoted values
    if ('"' == val[0]) {
      val = val.slice(1, -1)
    }

    // only assign once
    if (undefined == obj[key]) {
      obj[key] = tryDecode(val, dec)
    }
  }

  return obj
}
