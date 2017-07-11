## 0.7.2
* Throttle the update of images for a less jumpy experience
* The dot executable can now be detected from the PATH variable

## 0.7.1
* Fixed menu labels to display the correct text
* Replaced usage of some deprecated APIs

## 0.7.0
* Added functionality for copying diagrams as PNG images
* Upgraded node-plantuml for bug fixes
* Fixed deserialization issues

## 0.6.1
* Fixed a problem with the PlantUML view title not being displayed properly

## 0.6.0
* Added serialization and deserialization of PlantUML views
* Added configuration for charset
* Made it possible to split PlantUML views
* Fixed include paths to work in Windows

## 0.5.0
* Added support for including multiple source files via relative include paths

## 0.4.1
* Fixed so that hovering over diagram text don't cause the mouse cursor to change
* Fixed a bug where updating a view when it was not visible would cause errors

## 0.4.0
* Added configuration for PlantUML config file, read before each diagram
* Improved viewport handling while doing live update and while resizing panels
* Fixed a bug where svg-pan-zoom was still considered constructed after destruction
* Fixed a bug where resizing view when it was not visible would cause errors

## 0.3.0
* Added pan and zoom controls for the PlantUML diagrams

## 0.2.1
* Updated minimum version of node-plantuml dependency

## 0.2.0
* Added functionality to save diagrams as PNG, SVG or EPS
* Added configuration for Graphviz dot executable

## 0.1.6
* UML diagrams are set to always fill the whole pane
* Added padding to the diagram

## 0.1.3
* Added configuration for live updates
* Added configuration for split pane

## 0.1.2
* Sped up updates by using SVG instead of PNG
* Sped up updates by updating on every change

## 0.1.1
* Displays PlantUML diagram in a new pane when toggling
* Updates the diagram live as the source is updated
