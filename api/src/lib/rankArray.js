export default (arr) => {
  const num = arr.length
  var chars = Math.floor(Math.log(num) / Math.log(26)) + 1
  var prev = Math.pow(26, chars - 1)
  var ratio = chars > 1 ? (num + 1 - prev) / prev : num
  var part = Math.floor(ratio)
  var alpha = [partialAlphabet(part), partialAlphabet(part + 1)]
  var leap_step = ratio % 1,
    leap_total = 0.5
  var first = true
  var strings = []
  generateStrings(chars - 1, '')
  return strings

  function generateStrings(full, str) {
    if (full) {
      for (let i = 0; i < 26; i++) {
        generateStrings(full - 1, str + String.fromCharCode(97 + i))
      }
    } else {
      if (!first) strings.push(stripTrailingAs(str))
      else first = false
      var leap = Math.floor((leap_total += leap_step))
      leap_total %= 1
      for (let i = 0; i < part + leap; i++) {
        strings.push(str + alpha[leap][i])
      }
    }
  }
  function stripTrailingAs(str) {
    var last = str.length - 1
    while (str.charAt(last) == 'a') --last
    return str.slice(0, last + 1)
  }
  function partialAlphabet(num) {
    var magic = [
      0, 4096, 65792, 528416, 1081872, 2167048, 2376776, 4756004, 4794660,
      5411476, 9775442, 11097386, 11184810, 22369621,
    ]
    var bits = num < 13 ? magic[num] : 33554431 - magic[25 - num]
    var chars = []
    for (var i = 1; i < 26; i++, bits >>= 1) {
      if (bits & 1) chars.push(String.fromCharCode(97 + i))
    }
    return chars
  }
}
