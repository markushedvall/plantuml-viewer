/* global jasmine atom beforeEach waitsForPromise waitsFor runs describe it expect */
'use strict'

var PlantumlViewerEditor = require('../lib/plantuml-viewer-editor')
var PlantumlViewerView = require('../lib/plantuml-viewer-view')
var plantuml = require('node-plantuml')
var temp = require('temp')
var fs = require('fs')

temp.track()

describe('PlantumlViewerView', function () {
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
      var viewerEditor = new PlantumlViewerEditor('uri', editor.id)
      view = new PlantumlViewerView(viewerEditor)
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
      var viewerFilePath = view.image.attr('src')
      var viewerImage = fs.readFileSync(viewerFilePath)
      var expectedImage = fs.readFileSync(tempStream.path)

      var diff = Buffer.compare(viewerImage, expectedImage)
      expect(diff).toBe(0)
    })
  })

  describe('when the editor text is modified', function () {
    it('should display an updated image', function () {
      var previousViewerPath
      runs(function () {
        previousViewerPath = view.image.attr('src')
        editor.getBuffer().setText('A -> C')
      })
      waitsFor(function () {
        return (view.image.attr('src') !== previousViewerPath)
      })

      runs(function () {
        var viewerFilePath = view.image.attr('src')
        var previousImage = fs.readFileSync(previousViewerPath)
        var viewerImage = fs.readFileSync(viewerFilePath)

        var previousDiff = Buffer.compare(previousImage, viewerImage)
        expect(previousDiff).not.toBe(0)
      })
    })
  })
})
