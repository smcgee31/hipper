#!/usr/bin/env node

'use strict'

const
  fs       = require('fs')
, es       = require('event-stream')
, Document = require('./lib/document')
, keys     = require('./lib/keys')
, config   = require('./lib/config')

let render = require('./lib/render')
require('ansi-recover')({cursor : true, mouse : true})

if (config.v || config.version) {
  console.log(require('./package.json').version)
  process.exit()
}

function hipper (rc, doc) {

  doc = doc || new Document() // internal representation of text file

  render = render(doc, rc)

  require('keypress').enableMouse(process.stdin)

  let input = process.stdin

  if (rc.playback) {
    input = fs.createReadStream(rc.playback).pipe(es.split()).pipe(es.parse())
  } else {
    process.stdin.setRawMode(true)
    process.stdin.resume()
    input = process.stdin
  }

  if (rc.output) {
    let
      write = process.stdout.write
    , os    = fs.createWriteStream(rc.output)
    process.stdout.write = data => {
      os.write(JSON.stringify(data.toString()) + '\n')
      write.call(process.stdout, data)
    }
  }

  if (rc.record) {
    process.stdin.pipe(es.stringify()).pipe(fs.createWriteStream(rc.record))
  }
  if (rc.raw) {
    let
      write = process.stdout.write
    , os    = fs.createWriteStream(rc.raw)
    process.stdout.write = data => {
      os.write(data)
      write.call(process.stdout, data)
    }
  }

//  input.on('keypress', function (e, k) {
//    console.error(e, k)
//  })
//  input.on('mousepress', function (e, m) {
//    console.error('MMM', e, m)
//  })
//  input.on('data', function (data) {
//    console.error(['data', data.toString() ])
//  })

  const hip = {
    config    : rc
  , plugins   : []
  , renderers : render.renderers /// list of things to draw
  , render: render // thing that draws
  , use (plugin) { // use things
      if (plugin) {
        this.plugins.push(plugin)
      }
      return this
    }
  , init () { // call plugins, pass them stuff
      let self = this
      this.plugins.forEach(plug => {
        plug.call(self, doc, keys, render)
      })
      render.redraw()
      return this
    }
  }
  return hip
}

if (!module.parent) {

  hipper(config)
  .use(require('./plugins/basics'))
  .use(require('./plugins/lines'))
  .use(require('./plugins/indent'))
  .use(require('./plugins/comment'))
  .use(require('./plugins/search'))
  .use(require('./plugins/entry'))
  .use(require('./plugins/highlight'))
  .use(require('./plugins/easy-writer'))
  .use(require('./plugins/control'))
  .use(require('./plugins/movement'))
  .use(require('./plugins/selection')) //MUST come after movement.
  .use(require('./plugins/line-nums')) //MUST come after selection.
  .init()
}

module.exports = hipper

