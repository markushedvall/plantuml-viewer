PlantumlPreviewView = require './plantuml-preview-view'
{CompositeDisposable} = require 'atom'

module.exports = PlantumlPreview =
  plantumlPreviewView: null
  modalPanel: null
  subscriptions: null

  activate: (state) ->
    @plantumlPreviewView = new PlantumlPreviewView(state.plantumlPreviewViewState)
    @modalPanel = atom.workspace.addModalPanel(item: @plantumlPreviewView.getElement(), visible: false)

    # Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    @subscriptions = new CompositeDisposable

    # Register command that toggles this view
    @subscriptions.add atom.commands.add 'atom-workspace', 'plantuml-preview:toggle': => @toggle()

  deactivate: ->
    @modalPanel.destroy()
    @subscriptions.dispose()
    @plantumlPreviewView.destroy()

  serialize: ->
    plantumlPreviewViewState: @plantumlPreviewView.serialize()

  toggle: ->
    console.log 'PlantumlPreview was toggled!'

    if @modalPanel.isVisible()
      @modalPanel.hide()
    else
      @modalPanel.show()
