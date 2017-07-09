/* global atom */
'use strict'
module.exports = PlantumlViewerEditor

var PlantumlViewerView = require('./plantuml-viewer-view')
var CompositeDisposable = require('atom').CompositeDisposable
var Emitter = require('atom').Emitter

function PlantumlViewerEditor (uri, editorId) {
  var self = this

  self.uri = uri
  self.editorId = editorId
  self.emitter = new Emitter()
  self.editor = null
  self.disposables = new CompositeDisposable()

  function resolve () {
    if (!self.editor) {
      self.editor = getEditorForId(editorId)
    }
  }

  self.resolve = resolve

  if (atom.workspace) resolve()
  else self.disposables.add(atom.packages.onDidActivateInitialPackages(resolve))
}

PlantumlViewerEditor.prototype.destroy = function () {
  this.disposables.dispose()
}

PlantumlViewerEditor.prototype.serialize = function () {
  return {
    deserializer: 'PlantumlViewerEditor',
    editorId: this.editorId,
    uri: this.uri
  }
}

PlantumlViewerEditor.prototype.getViewClass = function () {
  if (atom.workspace) this.resolve()
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
  if (this.editor) return this.editor.getText()
  return ''
}

PlantumlViewerEditor.prototype.getBuffer = function () {
  if (this.editor) return this.editor.getBuffer()
  return Buffer.alloc(0)
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
