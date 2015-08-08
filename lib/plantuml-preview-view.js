'use strict'
module.exports = PlantumlPreviewView

var CompositeDisposable = require('atom').CompositeDisposable
var ScrollView = require('atom-space-pen-views').ScrollView
var plantuml = require('node-plantuml')
var inherits = require('./cs-inherits')

PlantumlPreviewView.content = function () {
  PlantumlPreviewView.div({ class: 'plantuml-preview' }, function () {
    PlantumlPreviewView.img({ outlet: 'image' })
  })
}

inherits(PlantumlPreviewView, ScrollView)
function PlantumlPreviewView (editor) {
  ScrollView.call(this)

  this.attached = attached
  this.detached = detached

  var temp = require('temp')
  var image = this.image
  var disposables

  temp.track()

  function attached () {
    disposables = new CompositeDisposable()
    updateImage()
    disposables.add(editor.getBuffer().onDidStopChanging(updateImage))
  }

  function detached () {
    disposables.dispose()
    temp.cleanup()
  }

  function updateImage () {
    var tempStream = temp.createWriteStream()

    var gen = plantuml.generate(editor.getText(), { format: 'png' })
    gen.out.pipe(tempStream)

    tempStream.on('finish', function () {
      image.attr('src', tempStream.path)
    })
  }
}
