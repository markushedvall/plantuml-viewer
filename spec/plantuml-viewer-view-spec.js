/* global jasmine atom beforeEach waitsForPromise waitsFor runs describe it expect */
'use strict'

var PlantumlViewerEditor = require('../lib/plantuml-viewer-editor')
var PlantumlViewerView = require('../lib/plantuml-viewer-view')

describe('PlantumlViewerView', function () {
  var editor
  var view

  beforeEach(function () {
    jasmine.useRealClock()
    atom.config.set('plantuml-viewer.liveUpdate', true)
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
      viewerEditor.getViewClass()
      view = new PlantumlViewerView(viewerEditor)
      jasmine.attachToDOM(view.element)
    })
    waitsFor(function () {
      return view.html().indexOf('svg') !== -1
    })
  })

  it('should contain svg generated from text editor', function () {
    runs(function () {
      expect(view.html()).toContain('svg')
    })
  })

  describe('when the editor text is modified', function () {
    it('should display an updated image', function () {
      var previousHtml
      runs(function () {
        previousHtml = view.html()
        editor.getBuffer().setText('A -> C')
      })
      waitsFor(function () {
        return view.html() !== previousHtml
      })

      runs(function () {
        expect(view.html()).not.toBe(previousHtml)
      })
    })
  })
})
