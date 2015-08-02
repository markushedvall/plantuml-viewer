/* global atom beforeEach waitsForPromise runs describe it expect */
'use strict'

var PlantumlPreviewEditor = require('../lib/plantuml-preview-editor')
var PlantumlPreviewView = require('../lib/plantuml-preview-view')
var temp = require('temp')
var path = require('path')
var wrench = require('wrench')

var FIXTURES_PATH = path.join(__dirname, 'fixtures')

temp.track()

describe('PlantumlPreviewEditor', function () {

  beforeEach(function () {
    var tempPath = temp.mkdirSync('plantuml-preview')
    wrench.copyDirSyncRecursive(FIXTURES_PATH, tempPath, { forceDelete: true })
    atom.project.setPaths([tempPath])
  })

  function waitsForOpeningEditor () {
    waitsForPromise(function () {
      return atom.workspace.open('file.puml')
    })
  }

  describe('::getViewClass', function () {
    it('should be a constructor for PlantumlPreviewView', function () {
      waitsForOpeningEditor()
      runs(function () {
        var editor = atom.workspace.getActiveTextEditor()
        var previewEditor = new PlantumlPreviewEditor('uri', editor.id)
        var ViewCLass = previewEditor.getViewClass()
        expect(ViewCLass).toBe(PlantumlPreviewView)
      })
    })
  })

  describe('::getUri', function () {
    it('should be same uri as put into the constructor', function () {
      waitsForOpeningEditor()
      runs(function () {
        var editor = atom.workspace.getActiveTextEditor()

        var uri = 'uri'
        var previewEditor = new PlantumlPreviewEditor(uri, editor.id)
        expect(previewEditor.getURI()).toBe(uri)
      })
    })
  })

  describe('::getTitle', function () {
    it('should be plantuml editor title + " Preview"', function () {
      waitsForOpeningEditor()
      runs(function () {
        var editor = atom.workspace.getActiveTextEditor()
        var previewEditor = new PlantumlPreviewEditor('uri', editor.id)
        expect(previewEditor.getTitle()).toBe(editor.getTitle() + ' Preview')
      })
    })
  })

  describe('::getPath', function () {
    it('should be same as plantuml editor path', function () {
      waitsForOpeningEditor()
      runs(function () {
        var editor = atom.workspace.getActiveTextEditor()
        var previewEditor = new PlantumlPreviewEditor('uri', editor.id)
        expect(previewEditor.getPath()).toBe(editor.getPath())
      })
    })
  })

  describe('::getText', function () {
    it('should be same as plantuml editor text', function () {
      waitsForOpeningEditor()
      runs(function () {
        var editor = atom.workspace.getActiveTextEditor()
        var previewEditor = new PlantumlPreviewEditor('uri', editor.id)
        expect(previewEditor.getText()).toBe(editor.getText())
      })
    })
  })
})
