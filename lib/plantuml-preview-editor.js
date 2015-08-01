'use strict'
module.exports = PlantumlPreviewEditor

var PlantumlPreviewView = require('./plantuml-preview-view')

function PlantumlPreviewEditor (editorId) {

}

PlantumlPreviewEditor.prototype.getViewClass = function () {
  return PlantumlPreviewView
}

PlantumlPreviewEditor.prototype.getTitle = function () {
  return 'PlantumlPreviewEditor'
}
