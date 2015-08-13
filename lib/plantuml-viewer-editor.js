/* global atom */
'use strict'
module.exports = PlantumlViewerEditor

var PlantumlViewerView = require('./plantuml-viewer-view')

function PlantumlViewerEditor (uri, editorId) {
  this.uri = uri
  this.id = editorId
  this.editor = getEditorForId(editorId)
}

PlantumlViewerEditor.prototype.getViewClass = function () {
  return PlantumlViewerView
}

PlantumlViewerEditor.prototype.getTitle = function () {
  return this.editor.getTitle() + ' View'
}

PlantumlViewerEditor.prototype.getPath = function () {
  return this.editor.getPath()
}

PlantumlViewerEditor.prototype.getURI = function () {
  return this.uri
}

PlantumlViewerEditor.prototype.getText = function () {
  return this.editor.getText()
}

PlantumlViewerEditor.prototype.getBuffer = function () {
  return this.editor.getBuffer()
}

PlantumlViewerEditor.prototype.isEqual = function (other) {
  return other instanceof PlantumlViewerEditor &&
         this.getURI() === other.getURI()
}

function getEditorForId (editorId) {
  var editors = atom.workspace.getTextEditors()
  for (var i in editors) {
    var editor = editors[i]
    if (editor.id.toString() === editorId.toString()) return editor
  }
}
