/* global atom */
'use strict'

var PlantumlPreviewView = require('./plantuml-preview-view')
var CompositeDisposable = require('atom').CompositeDisposable

var plantumlPreviewView
var subscriptions
var modalPanel

function toggle () {
  var editor = atom.workspace.getActiveTextEditor()
  if (!editor || editor.getGrammar().scopeName !== 'plantuml') return

  if (modalPanel.isVisible()) {
    modalPanel.hide()
  } else {
    modalPanel.show()
  }
}

module.exports.activate = function (state) {
  plantumlPreviewView = new PlantumlPreviewView(state.plantumlPreviewViewState)
  modalPanel = atom.workspace.addModalPanel({
    item: plantumlPreviewView.getElement(),
    visible: false
  })

  subscriptions = new CompositeDisposable()
  subscriptions.add(atom.commands.add('atom-workspace', {
    'plantuml-preview:toggle': toggle
  }))
}

module.exports.deactivate = function () {
  modalPanel.destroy()
  subscriptions.dispose()
  plantumlPreviewView.destroy()
}

module.exports.serialize = function () {
  return {
    plantumlPreviewViewState: plantumlPreviewView.serialize()
  }
}
