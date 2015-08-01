/* global atom */
'use strict'

var CompositeDisposable = require('atom').CompositeDisposable
var url = require('url')

var PLANTUML_PREVIEW_URI_PROTOCOL = 'plantuml-preview:'
var PlantumlPreviewEditor
var disposables

module.exports.activate = function (state) {
  disposables = new CompositeDisposable()
  disposables.add(atom.commands.add('atom-workspace', {
    'plantuml-preview:toggle': toggle
  }))

  disposables.add(atom.workspace.addOpener(plantumlPreviewOpener))
}

module.exports.deactivate = function () {
  disposables.dispose()
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

function plantumlPreviewOpener (uri) {
  try {
    var parsedUri = url.parse(uri)
  } catch (err) { return }

  if (parsedUri.protocol !== PLANTUML_PREVIEW_URI_PROTOCOL) return

  var editorId = parsedUri.pathname.substring(1)
  return createPlantumlPreviewEditor(editorId)
}

function createPlantumlPreviewEditor (editorId) {
  if (!PlantumlPreviewEditor) {
    PlantumlPreviewEditor = require('./plantuml-preview-editor')
  }
  return new PlantumlPreviewEditor(editorId)
}
