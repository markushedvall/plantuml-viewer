'use strict'
module.exports = PlantumlPreviewView

var ScrollView = require('atom-space-pen-views').ScrollView
var plantuml = require('node-plantuml')
var temp = require('temp')
var inherits = require('./cs-inherits')

plantuml.useNailgun()
temp.track()

inherits(PlantumlPreviewView, ScrollView)
function PlantumlPreviewView (editor) {
  ScrollView.call(this)
  var self = this

  self.updateImage = function () {
    var tempStream = temp.createWriteStream()
    var tempUri = tempStream.path

    var gen = plantuml.generate(editor.getText(), { format: 'png' })
    gen.out.pipe(tempStream)

    tempStream.on('finish', function () {
      self.image.attr('src', tempUri)
    })
  }

  self.updateImage()
}

PlantumlPreviewView.content = function () {
  PlantumlPreviewView.div({ class: 'plantuml-preview' }, function () {
    PlantumlPreviewView.img({ outlet: 'image' })
  })
}
