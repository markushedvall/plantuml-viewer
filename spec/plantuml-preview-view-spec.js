/* global jasmine atom beforeEach waitsForPromise waitsFor runs describe it expect */
'use strict'

var PlantumlPreviewEditor = require('../lib/plantuml-preview-editor')
var PlantumlPreviewView = require('../lib/plantuml-preview-view')
var plantuml = require('node-plantuml')
var temp = require('temp')
var fs = require('fs')

temp.track()

describe('PlantumlPreviewView', function () {
  var editor
  var view

  beforeEach(function () {
    jasmine.useRealClock()
    waitsForPromise(function () {
      return atom.workspace.open('file.puml')
    })
    runs(function () {
      editor = atom.workspace.getActiveTextEditor()
    })
    waitsFor(function (done) {
      editor.onDidStopChanging(done)
    })
    runs(function () {
      var previewEditor = new PlantumlPreviewEditor('uri', editor.id)
      view = new PlantumlPreviewView(previewEditor)
      jasmine.attachToDOM(view.element)
    })
    waitsFor(function () {
      return view.image.attr('src')
    })
  })

  it('should contain png generated from text editor', function () {
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

  describe('when the editor text is modified', function () {
    it('should display an updated image', function () {
      var previousPreviewPath
      runs(function () {
        previousPreviewPath = view.image.attr('src')
        editor.getBuffer().setText('A -> C')
      })
      waitsFor(function () {
        return (view.image.attr('src') !== previousPreviewPath)
      })

      runs(function () {
        var previewFilePath = view.image.attr('src')
        var previousImage = fs.readFileSync(previousPreviewPath)
        var previewImage = fs.readFileSync(previewFilePath)

        var previousDiff = Buffer.compare(previousImage, previewImage)
        expect(previousDiff).not.toBe(0)
      })
    })
  })
})
