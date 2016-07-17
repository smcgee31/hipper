'use strict'

const
  styles    = require('../lib/styles')
, keyword   = /\s(break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|function|if|implements|import|in|instanceof|interface|let|new|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\s/g
, rbrace    = /[\(\)]/g
, sbrace    = /[\[\]]/g
, cbrace    = /[\{\}]/g
, number    = /-?\d+(?:\.\d+)?(?:e-?\d+)?/g
, string    = /('[^']*')|("[^"]*")|(`[^`]*`)/g
, comment   = /\/\/[^\n]*/g
, primitive = /\s(true|false|null|NaN)\s/g

exports.highlight = q => {
  q.wrap(rbrace    , styles.brightCyan)
  q.wrap(sbrace    , styles.brightYellow)
  q.wrap(cbrace    , styles.brightGreen)
  q.wrap(number    , styles.brightMagenta)
  q.wrap(primitive , styles.magenta)
  q.wrap(keyword   , styles.brightBlue)
  q.wrap(comment   , styles.grey)
  q.wrap(string    , styles.red)
}

exports.test = file => {
  return true
  return /\.(json|js)$/.test(file)
}
