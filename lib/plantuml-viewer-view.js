/* global atom */
'use strict'
module.exports = PlantumlViewerView

var CompositeDisposable = require('atom').CompositeDisposable
var ScrollView = require('atom-space-pen-views').ScrollView
var plantuml = require('node-plantuml')
var inherits = require('./cs-inherits')
var path = require('path')
var fs = require('fs')
var svgPanZoom = require('svg-pan-zoom/src/svg-pan-zoom')
var nativeImage = require('electron').nativeImage
var clipboard = require('clipboard')

PlantumlViewerView.content = function () {
  PlantumlViewerView.div({
    class: 'plantuml-viewer native-key-bindings',
    tabindex: -1
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

  var includePath = path.dirname(editor.getPath())

  self.on('click', function () {
    atom.workspace.paneForURI(editor.getURI()).activate()
  })

  atom.workspace.onDidChangeActivePaneItem(function () {
    // The DOM and visibility is not yet updated
    var wasVisible = self.is(':visible')
    if (wasVisible) return
    // wait until update is complete
    setTimeout(function () {
      updatePanZoom()
    }, 0)
  })

  function getDetectedPathFor (execName) {
    for (var pathsDir of process.env.PATH.split(path.delimiter)) {
      var candidateExecPath = path.join(pathsDir, execName)
      if (fs.existsSync(candidateExecPath)) {
        return candidateExecPath
      }
    }
  }

  var updateImageTimerId = 0
  function queueUpdate () {
    if (updateImageTimerId) return
    updateImageTimerId = setTimeout(function () {
      updateImage()
      updateImageTimerId = 0
    }, 20)
  }

  function attached () {
    disposables = new CompositeDisposable()
    queueUpdate()
    if (atom.config.get('plantuml-viewer.liveUpdate')) {
      disposables.add(editor.getBuffer().onDidChange(function () {
        if (loading) {
          waitingToLoad = true
          return
        }
        queueUpdate()
      }))

      interval = setInterval(function () {
        if (panZoom) {
          if (width !== self.width() || height !== self.height()) {
            queueUpdate()
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
    atom.commands.add(self.element, 'core:copy', function (event) {
      event.stopPropagation()
      copy()
    })
  }

  function detached () {
    disposables.dispose()
    if (panZoom) panZoom.destroy()
    panZoom = undefined

    clearInterval(interval)
  }

  function updatePanZoom () {
    if (!self.is(':visible')) return

    var svgElement = self.find('svg')[0]
    if (!svgElement) return

    var newPanZoom = svgPanZoom(svgElement)

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
      oldPanZoom = undefined
    }

    panZoom = newPanZoom
  }

  function updateImage () {
    loading = true

    var options = {
      format: 'svg',
      include: includePath,
      dot: atom.config.get('plantuml-viewer.graphvizDotExecutable') || getDetectedPathFor('dot'),
      config: atom.config.get('plantuml-viewer.configFile'),
      charset: atom.config.get('plantuml-viewer.charset')
    }

    var gen = plantuml.generate(editor.getText(), options)

    var chunks = []
    gen.out.on('data', function (chunk) { chunks.push(chunk) })
    gen.out.on('end', function () {
      var data = Buffer.concat(chunks)
      self.html(data.toString())

      updatePanZoom()

      if (waitingToLoad) {
        waitingToLoad = false
        queueUpdate()
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
        include: includePath,
        dot: atom.config.get('plantuml-viewer.graphvizDotExecutable') || getDetectedPathFor('dot'),
        config: atom.config.get('plantuml-viewer.configFile'),
        charset: atom.config.get('plantuml-viewer.charset')
      }

      var gen = plantuml.generate(editor.getText(), plantumlOptions)
      gen.out.pipe(fileStream)
    }
  }

  function copy () {
    var options = {
      format: 'png',
      include: includePath,
      dot: atom.config.get('plantuml-viewer.graphvizDotExecutable') || getDetectedPathFor('dot'),
      config: atom.config.get('plantuml-viewer.configFile'),
      charset: atom.config.get('plantuml-viewer.charset')
    }

    var gen = plantuml.generate(editor.getText(), options)

    var chunks = []
    gen.out.on('data', function (chunk) { chunks.push(chunk) })
    gen.out.on('end', function () {
      var buffer = Buffer.concat(chunks)
      var image = nativeImage.createFromBuffer(buffer)
      clipboard.writeImage(image)
    })
  }
}
