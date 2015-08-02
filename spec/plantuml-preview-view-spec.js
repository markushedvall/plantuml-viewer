/* global atom beforeEach waitsForPromise waitsFor runs describe it expect */
'use strict'

var PlantumlPreviewEditor = require('../lib/plantuml-preview-editor')
var PlantumlPreviewView = require('../lib/plantuml-preview-view')
var plantuml = require('node-plantuml')
var temp = require('temp')
var fs = require('fs')

describe('PlantumlPreviewView', function () {
  var editor
  var view

  beforeEach(function () {
    waitsForPromise(function () {
      return atom.workspace.open('file.puml')
    })
    runs(function () {
      editor = atom.workspace.getActiveTextEditor()
      var previewEditor = new PlantumlPreviewEditor('uri', editor.id)
      view = new PlantumlPreviewView(previewEditor)
    })
    waitsFor(function () {
      return view.image.attr('src')
    })
  })

  return it('should contain png generated from text editor', function () {
    var tempStream = temp.createWriteStream()
    var gen = plantuml.generate(editor.getText(), { format: 'png' })
    gen.out.pipe(tempStream)

    waitsFor(function (done) {
      tempStream.on('finish', done)
    })

    runs(function () {
      var previewFilePath = view.image.attr('src')
      var previewImage = fs.readFileSync(previewFilePath)
      var expectedImage = fs.readFileSync(tempStream.path)

      var diff = Buffer.compare(previewImage, expectedImage)
      expect(diff).toBe(0)
    })
  })
})
