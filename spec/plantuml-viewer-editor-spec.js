/* global atom waitsForPromise runs describe it expect */
'use strict'

var PlantumlViewerEditor = require('../lib/plantuml-viewer-editor')
var PlantumlViewerView = require('../lib/plantuml-viewer-view')

describe('PlantumlViewerEditor', function () {
  function waitsForOpeningEditor () {
    waitsForPromise(function () {
      return atom.workspace.open('file.puml')
    })
  }

  describe('::getViewClass', function () {
    it('should be a constructor for PlantumlViewerView', function () {
      waitsForOpeningEditor()
      runs(function () {
        var editor = atom.workspace.getActiveTextEditor()
        var viewerEditor = new PlantumlViewerEditor('uri', editor.id)
        var ViewCLass = viewerEditor.getViewClass()
        expect(ViewCLass).toBe(PlantumlViewerView)
      })
    })
  })

  describe('::getUri', function () {
    it('should be same uri as put into the constructor', function () {
      waitsForOpeningEditor()
      runs(function () {
        var editor = atom.workspace.getActiveTextEditor()

        var uri = 'uri'
        var viewerEditor = new PlantumlViewerEditor(uri, editor.id)
        expect(viewerEditor.getURI()).toBe(uri)
      })
    })
  })

  describe('::getTitle', function () {
    it('should be plantuml editor title + " View"', function () {
      waitsForOpeningEditor()
      runs(function () {
        var editor = atom.workspace.getActiveTextEditor()
        var viewerEditor = new PlantumlViewerEditor('uri', editor.id)
        viewerEditor.getViewClass()
        expect(viewerEditor.getTitle()).toBe(editor.getTitle() + ' View')
      })
    })
  })

  describe('::getPath', function () {
    it('should be same as plantuml editor path', function () {
      waitsForOpeningEditor()
      runs(function () {
        var editor = atom.workspace.getActiveTextEditor()
        var viewerEditor = new PlantumlViewerEditor('uri', editor.id)
        viewerEditor.getViewClass()
        expect(viewerEditor.getPath()).toBe(editor.getPath())
      })
    })
  })

  describe('::getText', function () {
    it('should be same as plantuml editor text', function () {
      waitsForOpeningEditor()
      runs(function () {
        var editor = atom.workspace.getActiveTextEditor()
        var viewerEditor = new PlantumlViewerEditor('uri', editor.id)
        viewerEditor.getViewClass()
        expect(viewerEditor.getText()).toBe(editor.getText())
      })
    })
  })

  describe('::getBuffer', function () {
    it('should be same as plantuml editor buffer', function () {
      waitsForOpeningEditor()
      runs(function () {
        var editor = atom.workspace.getActiveTextEditor()
        var viewerEditor = new PlantumlViewerEditor('uri', editor.id)
        viewerEditor.getViewClass()
        expect(viewerEditor.getBuffer()).toBe(editor.getBuffer())
      })
    })
  })
})
