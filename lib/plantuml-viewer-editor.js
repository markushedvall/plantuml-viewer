/* global atom */
'use strict'
module.exports = PlantumlViewerEditor

var PlantumlViewerView = require('./plantuml-viewer-view')
var Emitter = require('atom').Emitter

function PlantumlViewerEditor (uri, editorId) {
  this.uri = uri
  this.editorId = editorId
  this.emitter = new Emitter()
  this.editor = null
}

PlantumlViewerEditor.prototype.serialize = function () {
  return {
    deserializer: 'PlantumlViewerEditor',
    editorId: this.editorId,
    uri: this.uri
  }
}

PlantumlViewerEditor.prototype.getViewClass = function () {
  // Get editor here to be sure that atom workspace has been created
  this.editor = getEditorForId(this.editorId)
  this.emitter.emit('did-change-title')

  return PlantumlViewerView
}

PlantumlViewerEditor.prototype.getTitle = function () {
  if (this.editor) return this.editor.getTitle() + ' View'
  return 'PlantUML View'
}

PlantumlViewerEditor.prototype.getPath = function () {
  if (this.editor) return this.editor.getPath()
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
