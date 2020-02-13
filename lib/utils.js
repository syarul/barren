exports.assign = function () {
  return Object.assign.apply(this, arguments)
}

exports.assert = function (val, msg) {
  if (!val) throw new Error('(barren) ' + msg)
}

exports.equal = function (obj, ref) {
  return JSON.stringify(obj) === JSON.stringify(ref)
}
