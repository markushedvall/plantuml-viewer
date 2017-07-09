/* global atom beforeEach waitsForPromise waitsFor runs describe it expect */
'use strict'

var PlantumlViewerEditor = require('../lib/plantuml-viewer-editor')

var TOGGLE = 'plantuml-viewer:toggle'

describe('PlantumlViewer', function () {
  var activationPromise
  var workspaceElement

  beforeEach(function () {
    workspaceElement = atom.views.getView(atom.workspace)
    activationPromise = atom.packages.activatePackage('plantuml-viewer')

    waitsForPromise(function () {
      return atom.packages.activatePackage('language-plantuml')
    })
  })

  function getPanes () {
    return atom.workspace.getCenter().getPanes()
  }

  function waitsForViewerToBeCreated () {
    // Wait for the view to be created and the pane to be switched back
    waitsFor(function () {
      return getPanes()[1].getActiveItem() &&
             getPanes()[0].isActive()
    })
  }

  function waitsForActivation () {
    waitsForPromise(function () {
      return activationPromise
    })
  }

  function waitsForOpening (file) {
    waitsForPromise(function () {
      return atom.workspace.open(file)
    })
  }

  function runsToggle () {
    runs(function () {
      atom.commands.dispatch(workspaceElement, TOGGLE)
    })
  }

  describe('when the plantuml-viewer:toggle event is triggered', function () {
    it('should create a second pane', function () {
      waitsForOpening('file.puml')

      runs(function () {
        expect(getPanes()).toHaveLength(1)
      })

      runsToggle()
      waitsForActivation()
      waitsForViewerToBeCreated()

      runs(function () {
        expect(getPanes()).toHaveLength(2)
      })
    })

    it('should not add a new editor to first pane', function () {
      var firstPane = getPanes()[0]
      expect(firstPane.getItems()).toHaveLength(0)

      waitsForOpening('file.puml')

      runs(function () {
        expect(firstPane.getItems()).toHaveLength(1)
      })

      runsToggle()
      waitsForActivation()
      waitsForViewerToBeCreated()

      runs(function () {
        expect(firstPane.getItems()).toHaveLength(1)
      })
    })

    it('should keep first pane active', function () {
      var firstPane = getPanes()[0]

      waitsForOpening('file.puml')

      runs(function () {
        expect(firstPane.isActive()).toBe(true)
      })

      runsToggle()
      waitsForActivation()
      waitsForViewerToBeCreated()

      runs(function () {
        expect(firstPane.isActive()).toBe(true)
      })
    })

    it('should create a pane with a PlantumlViewerEditor', function () {
      waitsForOpening('file.puml')
      runsToggle()
      waitsForActivation()
      waitsForViewerToBeCreated()
      runs(function () {
        var viewer = getPanes()[1].getActiveItem()
        expect(viewer).toBeInstanceOf(PlantumlViewerEditor)
      })
    })

    it('should destroy active PlantumlViewerEditor', function () {
      waitsForOpening('file.puml')
      runsToggle()
      waitsForActivation()
      waitsForViewerToBeCreated()
      runs(function () {
        var viewerPane = getPanes()[1]
        expect(viewerPane.isActive()).toBe(false)

        viewerPane.activate()
        expect(viewerPane.isActive()).toBe(true)
        expect(viewerPane.getItems()).toHaveLength(1)

        atom.commands.dispatch(workspaceElement, TOGGLE)
        expect(viewerPane.getItems()).toHaveLength(0)
      })
    })

    it('should destroy editor on second toggle', function () {
      waitsForOpening('file.puml')
      runsToggle()
      waitsForActivation()
      waitsForViewerToBeCreated()
      runs(function () {
        var viewerPane = getPanes()[1]
        expect(viewerPane.getItems()).toHaveLength(1)
        atom.commands.dispatch(workspaceElement, TOGGLE)
        expect(viewerPane.getItems()).toHaveLength(0)
      })
    })

    it('should show viewer pane for text.plain files', function () {
      waitsForPromise(function () {
        return atom.packages.activatePackage('language-text')
      })
      waitsForOpening('text-plain.txt')
      runsToggle()
      waitsForActivation()
      waitsForViewerToBeCreated()
      runs(function () {
        expect(getPanes()).toHaveLength(2)
      })
    })

    it('should show viewer pane for text.plain.null-grammar files', function () {
      waitsForOpening('null-grammar')
      runsToggle()
      waitsForActivation()
      waitsForViewerToBeCreated()
      runs(function () {
        expect(getPanes()).toHaveLength(2)
      })
    })
  })
})
