# PlantUML Viewer package

Show the rendered [PlantUML](http://plantuml.sourceforge.net/) diagram to the right of the current editor

[![Build Status](https://travis-ci.org/markushedvall/plantuml-viewer.svg?branch=master)](https://travis-ci.org/markushedvall/plantuml-viewer) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

It can be activated from the editor using the `ctrl-alt-p` key-binding and is currently enabled for `.plantuml`, `.puml`, `.pu`, `.txt` and any other text files with unknown grammar.

![](https://dl.dropboxusercontent.com/u/10809390/plantuml-viewer.gif)

# Install

```
apm install plantuml-viewer
```
Install [Graphviz](http://www.graphviz.org/) to be able to generate all diagram types.

# Features

* Very fast live updates utilizing the power of PlantUML's SVG output and Atoms HTML views.
* Fluent controls for panning and zooming PlantUML diagrams, including touch support.
* Save UML diagrams as PNG, SVG or EPS.
* Copy UML diagrams as PNG images.
* Supports relative include paths in source files.

# Settings

* `Charset`: The charset used when generating diagrams.
* `Config File`: The config file that is read before each diagram is generated.
* `Grammars`: The grammar types that can be toggled to show a PlantUML view.
* `Graphviz Dot Executable`: The path to the Graphviz dot executable.
* `Live Update`: If checked the PlantUML views will be updated while typing. (default=true)
* `Split Pane`: If checked the PlantUML views will be opened in a split pane. (default=true)

# License
MIT
