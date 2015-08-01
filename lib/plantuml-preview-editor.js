'use strict'
module.exports = PlantumlPreviewEditor

var PlantumlPreviewView = require('./plantuml-preview-view')

function PlantumlPreviewEditor (uri, editorId) {
  this.uri = uri
}

PlantumlPreviewEditor.prototype.getViewClass = function () {
  return PlantumlPreviewView
}

PlantumlPreviewEditor.prototype.getTitle = function () {
  return this.uri
}

PlantumlPreviewEditor.prototype.getURI = function () {
  return this.uri
}
