'use babel'

/* global atom */

import {CompositeDisposable} from 'atom'
import plantuml from 'node-plantuml'
import url from 'url'
import config from './config.json'

export {activate, deactivate, config}

const PLANTUML_VIEWER_URI_PROTOCOL = 'plantuml-viewer:'
let PlantumlViewerEditor
let disposables
let nailgun

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
  deserialize: (state) => createPlantumlViewerEditor(state.uri, state.editorId)
})

function activate (state) {
  disposables = new CompositeDisposable()
  disposables.add(atom.commands.add('atom-workspace', {
    'plantuml-viewer:toggle': toggle
  }))

  disposables.add(atom.workspace.addOpener(plantumlViewerOpener))
}

function deactivate () {
  disposables.dispose()
  if (nailgun) nailgun.shutdown()
}

function toggle () {
  if (isMarkdownViewerView(atom.workspace.getActivePaneItem())) {
    atom.workspace.destroyActivePaneItem()
    return
  }

  const editor = atom.workspace.getActiveTextEditor()
  if (!editor) return

  const grammars = atom.config.get('plantuml-viewer.grammars') || []
  if (grammars.indexOf(editor.getGrammar().scopeName) === -1) return

  const uri = createPlantumlViewerUri(editor)
  const viewer = atom.workspace.paneForURI(uri)

  if (!viewer) addViewerForUri(uri)
  else viewer.destroyItem(viewer.itemForURI(uri))
}

function addViewerForUri (uri) {
  const prevActivePane = atom.workspace.getActivePane()
  const options = { searchAllPanes: true }

  if (atom.config.get('plantuml-viewer.openInSplitPane')) {
    options.split = 'right'
  }

  atom.workspace.open(uri, options).then((view) => prevActivePane.activate())
}

function createPlantumlViewerUri (editor) {
  return PLANTUML_VIEWER_URI_PROTOCOL + '//editor/' + editor.id
}

function plantumlViewerOpener (uri) {
  let parsedUri

  try {
    parsedUri = url.parse(uri)
  } catch (err) { return }

  if (parsedUri.protocol !== PLANTUML_VIEWER_URI_PROTOCOL) return

  const editorId = parsedUri.pathname.substring(1)
  return createPlantumlViewerEditor(uri, editorId)
}

function isMarkdownViewerView (object) {
  if (!PlantumlViewerEditor) {
    PlantumlViewerEditor = require('./plantuml-viewer-editor')
  }
  return object instanceof PlantumlViewerEditor
}
