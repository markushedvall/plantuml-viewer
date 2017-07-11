'use babel'

/* global atom */

import PlantumlViewerView from './plantuml-viewer-view'
import {CompositeDisposable, Emitter} from 'atom'

export default
class PlantumlViewerEditor {
  constructor (uri, editorId) {
    this.uri = uri
    this.editorId = editorId
    this.emitter = new Emitter()
    this.editor = null
    this.disposables = new CompositeDisposable()

    if (atom.workspace) this.resolve()
    else this.disposables.add(atom.packages.onDidActivateInitialPackages(this.resolve))
  }

  resolve () {
    if (!this.editor) {
      this.editor = this.getEditorForId(this.editorId)
    }
  }

  destroy () {
    this.disposables.dispose()
  }

  serialize () {
    return {
      deserializer: 'PlantumlViewerEditor',
      editorId: this.editorId,
      uri: this.uri
    }
  }

  getViewClass () {
    if (atom.workspace) this.resolve()
    return PlantumlViewerView
  }

  getTitle () {
    if (this.editor) return this.editor.getTitle() + ' View'
    return 'PlantUML View'
  }

  getPath () {
    if (this.editor) return this.editor.getPath()
  }

  getURI () {
    return this.uri
  }

  getText () {
    if (this.editor) return this.editor.getText()
    return ''
  }

  getBuffer () {
    if (this.editor) return this.editor.getBuffer()
    return Buffer.alloc(0)
  }

  isEqual (other) {
    return other instanceof PlantumlViewerEditor &&
           this.getURI() === other.getURI()
  }

  getEditorForId (editorId) {
    const editors = atom.workspace.getTextEditors()
    for (const editor of editors) {
      if (editor.id.toString() === editorId.toString()) return editor
    }
  }
}
