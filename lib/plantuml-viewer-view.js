'use babel'

/* global atom */

import {CompositeDisposable} from 'atom'
import {ScrollView} from 'atom-space-pen-views'
import plantuml from 'node-plantuml'
import path from 'path'
import fs from 'fs'
import svgPanZoom from 'svg-pan-zoom/src/svg-pan-zoom'
import {nativeImage} from 'electron'
import clipboard from 'clipboard'

export default
class PlantumlViewerView extends ScrollView {
  constructor (editor) {
    super()

    this.editor = editor
    this.disposables = undefined
    this.loading = false
    this.waitingToLoad = false

    this.panZoom = undefined
    this.centerPan = undefined
    this.interval = undefined
    this.width = undefined
    this.height = undefined

    this.includePath = path.dirname(this.editor.getPath())

    this.updateImageTimerId = 0

    this.on('click', () => {
      atom.workspace.paneForURI(this.editor.getURI()).activate()
    })

    atom.workspace.onDidChangeActivePaneItem(() => {
      // The DOM and visibility is not yet updated
      var wasVisible = super.is(':visible')
      if (wasVisible) return
      // wait until update is complete
      setTimeout(() => {
        this.updatePanZoom()
      }, 0)
    })
  }

  getDetectedPathFor (execName) {
    for (var pathsDir of process.env.PATH.split(path.delimiter)) {
      var candidateExecPath = path.join(pathsDir, execName)
      if (fs.existsSync(candidateExecPath)) {
        return candidateExecPath
      }
    }
  }

  queueUpdate () {
    if (this.updateImageTimerId) return
    this.updateImageTimerId = setTimeout(() => {
      this.updateImage()
      this.updateImageTimerId = 0
    }, 20)
  }

  attached () {
    this.disposables = new CompositeDisposable()
    this.queueUpdate()
    if (atom.config.get('plantuml-viewer.liveUpdate')) {
      this.disposables.add(this.editor.getBuffer().onDidChange(() => {
        if (this.loading) {
          this.waitingToLoad = true
          return
        }
        this.queueUpdate()
      }))

      this.interval = setInterval(() => {
        if (this.panZoom) {
          if (this.width !== super.width() || this.height !== super.height()) {
            this.queueUpdate()
            this.width = super.width()
            this.height = super.height()
          }
        }
      }, 500)
    }

    atom.commands.add(this.element, 'core:save-as', (event) => {
      event.stopPropagation()
      this.saveAs()
    })
    atom.commands.add(this.element, 'core:save', (event) => {
      event.stopPropagation()
      this.saveAs()
    })
    atom.commands.add(this.element, 'core:copy', (event) => {
      event.stopPropagation()
      this.copy()
    })
  }

  detached () {
    this.disposables.dispose()
    if (this.panZoom) this.panZoom.destroy()
    this.panZoom = undefined

    clearInterval(this.interval)
  }

  updatePanZoom () {
    if (!super.is(':visible')) return

    var svgElement = this.find('svg')[0]
    if (!svgElement) return

    var newPanZoom = svgPanZoom(svgElement)

    newPanZoom.center()
    var oldCenter = this.centerpan
    this.centerpan = newPanZoom.getPan()

    if (this.panZoom) {
      var oldPanZoom = this.panZoom

      var oldZoom = oldPanZoom.getZoom()
      oldPanZoom.resetZoom()
      var x = oldPanZoom.getPan().x - oldCenter.x
      var y = oldPanZoom.getPan().y - oldCenter.y

      newPanZoom.panBy({ x: x, y: y })
      newPanZoom.zoom(oldZoom)

      oldPanZoom.destroy()
      oldPanZoom = undefined
    }

    this.panZoom = newPanZoom
  }

  updateImage () {
    this.loading = true

    var options = {
      format: 'svg',
      include: this.includePath,
      dot: atom.config.get('plantuml-viewer.graphvizDotExecutable') || this.getDetectedPathFor('dot'),
      config: atom.config.get('plantuml-viewer.configFile'),
      charset: atom.config.get('plantuml-viewer.charset')
    }

    var gen = plantuml.generate(this.editor.getText(), options)

    var chunks = []
    gen.out.on('data', (chunk) => chunks.push(chunk))
    gen.out.on('end', () => {
      var data = Buffer.concat(chunks)
      super.html(data.toString())

      this.updatePanZoom()

      if (this.waitingToLoad) {
        this.waitingToLoad = false
        this.queueUpdate()
      }
      this.loading = false
    })
  }

  saveAs () {
    var filters = [
      { name: 'Encapsulated PostScript (.eps)', extensions: ['eps'] },
      { name: 'Scalable Vector Graphics (.svg)', extensions: ['svg'] },
      { name: 'Portable Network Graphics (.png)', extensions: ['png'] }
    ]
    var filePath = this.editor.getPath().replace(/\.[^/.]+$/, '')
    var options = { defaultPath: filePath, filters: filters }
    var savePath = atom.showSaveDialogSync(options)

    if (savePath) {
      var extension = savePath.substr(savePath.lastIndexOf('.') + 1)
      var fileStream = fs.createWriteStream(savePath)

      var plantumlOptions = {
        format: extension,
        include: this.includePath,
        dot: atom.config.get('plantuml-viewer.graphvizDotExecutable') || this.getDetectedPathFor('dot'),
        config: atom.config.get('plantuml-viewer.configFile'),
        charset: atom.config.get('plantuml-viewer.charset')
      }

      var gen = plantuml.generate(this.editor.getText(), plantumlOptions)
      gen.out.pipe(fileStream)
    }
  }

  copy () {
    var options = {
      format: 'png',
      include: this.includePath,
      dot: atom.config.get('plantuml-viewer.graphvizDotExecutable') || this.getDetectedPathFor('dot'),
      config: atom.config.get('plantuml-viewer.configFile'),
      charset: atom.config.get('plantuml-viewer.charset')
    }

    var gen = plantuml.generate(this.editor.getText(), options)

    var chunks = []
    gen.out.on('data', (chunk) => chunks.push(chunk))
    gen.out.on('end', () => {
      var buffer = Buffer.concat(chunks)
      var image = nativeImage.createFromBuffer(buffer)
      clipboard.writeImage(image)
    })
  }

  static content () {
    PlantumlViewerView.div({
      class: 'plantuml-viewer native-key-bindings',
      tabindex: -1
    })
  }
}
