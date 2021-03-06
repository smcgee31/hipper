'use strict'

const types = [
  require('../highlight/javascript')
, require('../highlight/scheme')
, require('../highlight/python')
, require('../highlight/ruby')
]

module.exports = function () {
  let rc   = this.config
  let file = rc.file

  if (rc.highlighting === false) {
    return
  }

  console.error(file, types)

  for (let i = 0; i < types.length; i++) {
    if (types[i].test(file)) {
      return this.renderers.push(types[i].highlight)
    }
  }
}
