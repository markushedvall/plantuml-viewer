/* global atom jasmine beforeEach waitsForPromise waitsFor runs describe it expect */
'use strict'

var PlantumlPreviewEditor = require('../lib/plantuml-preview-editor')
var temp = require('temp')
var path = require('path')
var wrench = require('wrench')

var FIXTURES_PATH = path.join(__dirname, 'fixtures')
var TOGGLE = 'plantuml-preview:toggle'

temp.track()

describe('PlantumlPreview', function () {
  var activationPromise
  var workspaceElement

  beforeEach(function () {
    var tempPath = temp.mkdirSync('plantuml-preview')
    wrench.copyDirSyncRecursive(FIXTURES_PATH, tempPath, { forceDelete: true })
    atom.project.setPaths([tempPath])

    workspaceElement = atom.views.getView(atom.workspace)
    activationPromise = atom.packages.activatePackage('plantuml-preview')
    jasmine.attachToDOM(workspaceElement)

    waitsForPromise(function () {
      return atom.packages.activatePackage('language-plantuml')
    })
  })

  function waitsForPreviewToBeCreated () {
    waitsFor(function () {
      return atom.workspace.getPanes()[1].getActiveItem()
    })
  }

  function waitsForActivation () {
    waitsForPromise(function () {
      return activationPromise
    })
  }

  function waitsForOpening (file) {
    waitsForPromise(function () {
      return atom.workspace.open('file.puml')
    })
  }

  function runsToggle () {
    runs(function () {
      atom.commands.dispatch(workspaceElement, TOGGLE)
    })
  }

  describe('when the plantuml-preview:toggle event is triggered', function () {
    it('should create a second pane', function () {
      waitsForOpening('file.puml')

      runs(function () {
        expect(atom.workspace.getPanes()).toHaveLength(1)
      })

      runsToggle()
      waitsForActivation()
      waitsForPreviewToBeCreated()

      runs(function () {
        expect(atom.workspace.getPanes()).toHaveLength(2)
      })
    })

    it('should not add a new editor to first pane', function () {
      var firstPane = atom.workspace.getPanes()[0]
      expect(firstPane.getItems()).toHaveLength(0)

      waitsForOpening('file.puml')

      runs(function () {
        expect(firstPane.getItems()).toHaveLength(1)
      })

      runsToggle()
      waitsForActivation()
      waitsForPreviewToBeCreated()

      runs(function () {
        expect(firstPane.getItems()).toHaveLength(1)
      })
    })

    it('should keep first pane active', function () {
      var firstPane = atom.workspace.getPanes()[0]

      waitsForOpening('file.puml')

      runs(function () {
        expect(firstPane.isActive()).toBe(true)
      })

      runsToggle()
      waitsForActivation()
      waitsForPreviewToBeCreated()

      runs(function () {
        expect(firstPane.isActive()).toBe(true)
      })
    })

    it('should create a pane with a PlantumlPreviewEditor', function () {
      waitsForOpening('file.puml')
      runsToggle()
      waitsForActivation()
      waitsForPreviewToBeCreated()
      runs(function () {
        var preview = atom.workspace.getPanes()[1].getActiveItem()
        expect(preview).toBeInstanceOf(PlantumlPreviewEditor)
      })
    })

  })
})
