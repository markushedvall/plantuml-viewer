'use strict'

module.exports = PlantumlPreviewView

function PlantumlPreviewView (serializedState) {
  // Create root element
  this.element = document.createElement('div')
  this.element.classList.add('plantuml-preview')

  // Create message element
  var message = document.createElement('div')
  message.textContent = "The PlantumlPreview package is Alive! It's ALIVE!"
  message.classList.add('message')
  this.element.appendChild(message)
}

// Returns an object that can be retrieved when package is activated
PlantumlPreviewView.prototype.serialize = function () {}

// Tear down any state and detach
PlantumlPreviewView.prototype.destroy = function () {
  this.element.remove()
}

PlantumlPreviewView.prototype.getElement = function () {
  return this.element
}
