# node-ditaa

Node.js API for [DiTAA](http://ditaa.sourceforge.net/). You can use [ASCIIFLOW](http://www.asciiflow.com) to draw your DiTAA diagrams.

## Prerequisites

Requires Java to be installed. Uses node-module [java](https://github.com/nearinfinity/node-java) as default to execute DiTAA.

## Installation

~~~bash
$ npm install node-ditaa
~~~

## Usage

~~~js
var ditaa = require('ditaa');
var fs = require('fs');

var asciiGraph = [
  '+-----+',
  '|     |',
  '+-----+'
].join('\n');

ditaa(asciiGraph, function(err, img) {
  if (err) {
    console.log(err);
  } else {
    fs.writeFileSync('graph.png', img);
  }
});
~~~

Options for `node-ditaa` can optionally be passed as second parameter (values are the default values):

~~~js
ditaa(asciiGraph, {
  antialias: true,
  dropShadows: true,
  debug: false,
  encoding: 'utf-8',
  roundedCorners: false,
  scale: 1,
  separationOfCommonEdges: true,
  tabSize: 0
}, function(err, img) {
  if (err) {
    console.log(err);
  } else {
    fs.writeFileSync('graph.png', img);
  }
});
~~~

If the node-module [java](https://github.com/nearinfinity/node-java) does not work, you can fallback to normal
java command line execution (which is much slower):

~~~js
ditaa.enableJavaExec();
// optionally set the java executable path
ditaa.enableJavaExec('/path/to/java');
// ditaa.disableJavaExec();
~~~

## License

node-ditaa (MIT)

Copyright (C) 2013 Tobias von Klipstein

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---------------------------------------

DiTAA - Diagrams Through Ascii Art (GPLv2)

Copyright (C) 2004 Efstathios Sideris

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
