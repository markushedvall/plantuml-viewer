/* global atom */
'use strict'

var PlantumlPreviewView = require('./plantuml-preview-view')
var CompositeDisposable = require('atom').CompositeDisposable

var PLANTUML_PREVIEW_URI_PROTOCOL = 'plantuml-preview:'

var plantumlPreviewView
var subscriptions

module.exports.activate = function (state) {
  plantumlPreviewView = new PlantumlPreviewView(state.plantumlPreviewViewState)

  subscriptions = new CompositeDisposable()
  subscriptions.add(atom.commands.add('atom-workspace', {
    'plantuml-preview:toggle': toggle
  }))
}

module.exports.deactivate = function () {
  subscriptions.dispose()
  plantumlPreviewView.destroy()
}

module.exports.serialize = function () {
  return {
    plantumlPreviewViewState: plantumlPreviewView.serialize()
  }
}

function toggle () {
  var editor = atom.workspace.getActiveTextEditor()
  if (!editor || editor.getGrammar().scopeName !== 'plantuml') return

  addPreviewForEditor(editor)
}

function addPreviewForEditor (editor) {
  var prevActivePane = atom.workspace.getActivePane()
  var uri = createPlantumlPreviewUri(editor)

  var options = {
    searchAllPanes: true,
    split: 'right'
  }

  atom.workspace.open(uri, options).done(function (previewView) {
    prevActivePane.activate()
  })
}

function createPlantumlPreviewUri (editor) {
  return PLANTUML_PREVIEW_URI_PROTOCOL + '//editor/' + editor.id
}
