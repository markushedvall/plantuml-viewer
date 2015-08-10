'use strict'
module.exports = PlantumlViewerView

var CompositeDisposable = require('atom').CompositeDisposable
var ScrollView = require('atom-space-pen-views').ScrollView
var plantuml = require('node-plantuml')
var inherits = require('./cs-inherits')

PlantumlViewerView.content = function () {
  PlantumlViewerView.div({ class: 'plantuml-viewer' })
}

inherits(PlantumlViewerView, ScrollView)
function PlantumlViewerView (editor) {
  ScrollView.call(this)

  this.attached = attached
  this.detached = detached

  var self = this
  var disposables
  var loading = false
  var waitingToLoad = false

  function attached () {
    disposables = new CompositeDisposable()
    updateImage()
    disposables.add(editor.getBuffer().onDidChange(function () {
      if (loading) {
        waitingToLoad = true
        return
      }
      updateImage()
    }))
  }

  function detached () {
    disposables.dispose()
  }

  function updateImage () {
    loading = true
    var gen = plantuml.generate(editor.getText(), { format: 'svg' })

    var chunks = []
    gen.out.on('data', function (chunk) { chunks.push(chunk) })
    gen.out.on('end', function () {
      var data = Buffer.concat(chunks)
      self.html(data.toString())

      if (waitingToLoad) {
        waitingToLoad = false
        updateImage()
      }
      loading = false
    })
  }
}
