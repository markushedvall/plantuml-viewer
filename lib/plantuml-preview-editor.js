/* global atom */
'use strict'
module.exports = PlantumlPreviewEditor

var PlantumlPreviewView = require('./plantuml-preview-view')

function PlantumlPreviewEditor (uri, editorId) {
  this.uri = uri
  this.editor = getEditorForId(editorId)
}

PlantumlPreviewEditor.prototype.getViewClass = function () {
  return PlantumlPreviewView
}

PlantumlPreviewEditor.prototype.getTitle = function () {
  return this.editor.getTitle() + ' Preview'
}

PlantumlPreviewEditor.prototype.getPath = function () {
  return this.editor.getPath()
}

PlantumlPreviewEditor.prototype.getURI = function () {
  return this.uri
}

PlantumlPreviewEditor.prototype.getText = function () {
  return this.editor.getText()
}

PlantumlPreviewEditor.prototype.getBuffer = function () {
  return this.editor.getBuffer()
}

function getEditorForId (editorId) {
  var editors = atom.workspace.getTextEditors()
  for (var i in editors) {
    var editor = editors[i]
    if (editor.id.toString() === editorId.toString()) return editor
  }
}
