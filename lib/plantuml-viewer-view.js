/* global atom */
'use strict'
module.exports = PlantumlViewerView

var CompositeDisposable = require('atom').CompositeDisposable
var ScrollView = require('atom-space-pen-views').ScrollView
var $ = require('atom-space-pen-views').$
var plantuml = require('node-plantuml')
var inherits = require('./cs-inherits')
var fs = require('fs')
var svgPanZoom = require('svg-pan-zoom/src/svg-pan-zoom')

PlantumlViewerView.content = function () {
  PlantumlViewerView.div({
    class: 'plantuml-viewer native-key-bindings'
  })
}

inherits(PlantumlViewerView, ScrollView)
function PlantumlViewerView (editor) {
  ScrollView.call(this)

  this.attached = attached
  this.detached = detached

  var self = this
  var disposables
  var loading = false
  var waitingToLoad = false

  var panZoom
  var centerPan
  var interval
  var width
  var height

  function attached () {
    disposables = new CompositeDisposable()
    updateImage()
    if (atom.config.get('plantuml-viewer.liveUpdate')) {
      disposables.add(editor.getBuffer().onDidChange(function () {
        if (loading) {
          waitingToLoad = true
          return
        }
        updateImage()
      }))

      interval = setInterval(function () {
        if (panZoom) {
          if (width !== self.width() || height !== self.height()) {
            updateImage()
            width = self.width()
            height = self.height()
          }
        }
      }, 500)
    }

    atom.commands.add(self.element, 'core:save-as', function (event) {
      event.stopPropagation()
      saveAs()
    })
    atom.commands.add(self.element, 'core:save', function (event) {
      event.stopPropagation()
      saveAs()
    })
  }

  function detached () {
    disposables.dispose()
    if (panZoom) panZoom.destroy()

    clearInterval(interval)
  }

  function updateImage () {
    loading = true

    var options = {
      format: 'svg',
      dot: atom.config.get('plantuml-viewer.graphvizDotExecutable')
    }

    var gen = plantuml.generate(editor.getText(), options)

    var chunks = []
    gen.out.on('data', function (chunk) { chunks.push(chunk) })
    gen.out.on('end', function () {
      var data = Buffer.concat(chunks)
      self.html(data.toString())

      var newPanZoom = svgPanZoom(self.find('svg')[0])

      newPanZoom.center()
      var oldCenter = centerPan
      centerPan = newPanZoom.getPan()

      if (panZoom) {
        var oldPanZoom = panZoom

        var oldZoom = oldPanZoom.getZoom()
        oldPanZoom.resetZoom()
        var x = oldPanZoom.getPan().x - oldCenter.x
        var y = oldPanZoom.getPan().y - oldCenter.y

        newPanZoom.panBy({ x: x, y: y })
        newPanZoom.zoom(oldZoom)

        oldPanZoom.destroy()
      }

      panZoom = newPanZoom

      if (waitingToLoad) {
        waitingToLoad = false
        updateImage()
      }
      loading = false
    })
  }

  function saveAs () {
    var filters = [
      { name: 'Encapsulated PostScript (.eps)', extensions: ['eps'] },
      { name: 'Scalable Vector Graphics (.svg)', extensions: ['svg'] },
      { name: 'Portable Network Graphics (.png)', extensions: ['png'] }
    ]
    var filePath = editor.getPath().replace(/\.[^/.]+$/, '')
    var options = { defaultPath: filePath, filters: filters }
    var savePath = atom.showSaveDialogSync(options)

    if (savePath) {
      var extension = savePath.substr(savePath.lastIndexOf('.') + 1)
      var fileStream = fs.createWriteStream(savePath)

      var plantumlOptions = {
        format: extension,
        dot: atom.config.get('plantuml-viewer.graphvizDotExecutable')
      }

      var gen = plantuml.generate(editor.getText(), plantumlOptions)
      gen.out.pipe(fileStream)
    }
  }
}
