/* global atom jasmine beforeEach waitsForPromise runs describe it expect */
'use strict'

var temp = require('temp')
var path = require('path')
var wrench = require('wrench')

var FIXTURES_PATH = path.join(__dirname, 'fixtures')

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

    waitsForPromise(function () {
      return atom.packages.activatePackage('language-plantuml')
    })
  })

  describe('when the plantuml-preview:toggle event is triggered', function () {
    it('hides and shows the modal panel', function () {
      waitsForPromise(function () {
        return atom.workspace.open('file.puml')
      })

      runs(function () {
        expect(workspaceElement.querySelector('.plantuml-preview')).not.toExist()
        atom.commands.dispatch(workspaceElement, 'plantuml-preview:toggle')
      })

      waitsForPromise(function () {
        return activationPromise
      })

      runs(function () {
        expect(workspaceElement.querySelector('.plantuml-preview')).toExist()

        var plantumlPreviewElement = workspaceElement.querySelector('.plantuml-preview')
        expect(plantumlPreviewElement).toExist()

        var plantumlPreviewPanel = atom.workspace.panelForItem(plantumlPreviewElement)
        expect(plantumlPreviewPanel.isVisible()).toBe(true)
        atom.commands.dispatch(workspaceElement, 'plantuml-preview:toggle')
        expect(plantumlPreviewPanel.isVisible()).toBe(false)
      })
    })

    it('hides and shows the view', function () {
      waitsForPromise(function () {
        return atom.workspace.open('file.puml')
      })

      runs(function () {
        jasmine.attachToDOM(workspaceElement)
        expect(workspaceElement.querySelector('.plantuml-preview')).not.toExist()
        atom.commands.dispatch(workspaceElement, 'plantuml-preview:toggle')
      })

      waitsForPromise(function () {
        return activationPromise
      })

      runs(function () {
        var plantumlPreviewElement = workspaceElement.querySelector('.plantuml-preview')
        expect(plantumlPreviewElement).toBeVisible()
        atom.commands.dispatch(workspaceElement, 'plantuml-preview:toggle')
        expect(plantumlPreviewElement).not.toBeVisible()
      })
    })
  })
})
