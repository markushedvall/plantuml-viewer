/* global atom */
'use strict'

var CompositeDisposable = require('atom').CompositeDisposable
var plantuml = require('node-plantuml')
var url = require('url')
var config = require('./config.json')

var PLANTUML_VIEWER_URI_PROTOCOL = 'plantuml-viewer:'
var PlantumlViewerEditor
var disposables
var nailgun

function createPlantumlViewerEditor (uri, editorId) {
  if (!PlantumlViewerEditor) {
    PlantumlViewerEditor = require('./plantuml-viewer-editor')
  }
  if (!nailgun) {
    nailgun = plantuml.useNailgun()
  }
  return new PlantumlViewerEditor(uri, editorId)
}

atom.deserializers.add({
  name: 'PlantumlViewerEditor',
  deserialize: function (state) {
    return createPlantumlViewerEditor(state.uri, state.editorId)
  }
})

module.exports.config = config

module.exports.activate = function (state) {
  disposables = new CompositeDisposable()
  disposables.add(atom.commands.add('atom-workspace', {
    'plantuml-viewer:toggle': toggle
  }))

  disposables.add(atom.workspace.addOpener(plantumlViewerOpener))
}

module.exports.deactivate = function () {
  disposables.dispose()
  if (nailgun) nailgun.shutdown()
}

function toggle () {
  if (isMarkdownViewerView(atom.workspace.getActivePaneItem())) {
    atom.workspace.destroyActivePaneItem()
    return
  }

  var editor = atom.workspace.getActiveTextEditor()
  if (!editor) return

  var grammars = atom.config.get('plantuml-viewer.grammars') || []
  if (grammars.indexOf(editor.getGrammar().scopeName) === -1) return

  var uri = createPlantumlViewerUri(editor)
  var viewer = atom.workspace.paneForURI(uri)

  if (!viewer) addViewerForUri(uri)
  else viewer.destroyItem(viewer.itemForURI(uri))
}

function addViewerForUri (uri) {
  var prevActivePane = atom.workspace.getActivePane()
  var options = { searchAllPanes: true }

  if (atom.config.get('plantuml-viewer.openInSplitPane')) {
    options.split = 'right'
  }

  atom.workspace.open(uri, options).then(function (viewerView) {
    prevActivePane.activate()
  })
}

function createPlantumlViewerUri (editor) {
  return PLANTUML_VIEWER_URI_PROTOCOL + '//editor/' + editor.id
}

function plantumlViewerOpener (uri) {
  try {
    var parsedUri = url.parse(uri)
  } catch (err) { return }

  if (parsedUri.protocol !== PLANTUML_VIEWER_URI_PROTOCOL) return

  var editorId = parsedUri.pathname.substring(1)
  return createPlantumlViewerEditor(uri, editorId)
}

function isMarkdownViewerView (object) {
  if (!PlantumlViewerEditor) {
    PlantumlViewerEditor = require('./plantuml-viewer-editor')
  }
  return object instanceof PlantumlViewerEditor
}
