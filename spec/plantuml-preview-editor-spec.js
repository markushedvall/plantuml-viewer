/* global describe it expect */
'use strict'

var PlantumlPreviewEditor = require('../lib/plantuml-preview-editor')
var PlantumlPreviewView = require('../lib/plantuml-preview-view')

describe('PlantumlPreviewEditor', function () {
  describe('::getViewClass', function () {
    it('returns constructor for PlantumlPreviewView', function () {
      var editor = new PlantumlPreviewEditor(42)
      var ViewCLass = editor.getViewClass()
      var view = new ViewCLass()
      expect(view).toBeInstanceOf(PlantumlPreviewView)
    })
  })
})
