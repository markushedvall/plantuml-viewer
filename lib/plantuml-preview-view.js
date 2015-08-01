'use strict'
module.exports = PlantumlPreviewView

var ScrollView = require('atom-space-pen-views').ScrollView
var inherits = require('./cs-inherits')

inherits(PlantumlPreviewView, ScrollView)
function PlantumlPreviewView (editor) {
  ScrollView.call(this)
}

PlantumlPreviewView.content = function () {
  PlantumlPreviewView.div(function () {
    PlantumlPreviewView.h4('PlantumlPreviewView')
  })
}
