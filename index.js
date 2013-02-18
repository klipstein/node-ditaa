var execNodeJava = require('./node_java.js');
var execJar = require('./exec.js');
var TempFile = require('temporary/lib/file');

module.exports = function(graphString, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  var inFile = new TempFile();
  var outFile = new TempFile();
  inFile.writeFileSync(graphString);

  if (useJavaExec) {
    options = execJar.prepareOptions(options, defaultOptions);
    execJar(inFile, outFile, options, javaExecutable, callback);
  } else {
    options = execNodeJava.prepareOptions(options, defaultOptions);
    execNodeJava(inFile, outFile, options, callback);
  }
};

var useJavaExec = false;
var javaExecutable = 'java';
module.exports.enableJavaExec = function(javaExecPath) {
  useJavaExec = true;
  if (javaExecPath) {
    javaExecutable = javaExecPath;
  }
};
module.exports.disableJavaExec = function() {
  useJavaExec = false;
};

var defaultOptions = module.exports.defaultOptions = {
  // options to disable feature
  antialias: ['A', true],
  separationOfCommonEdges: ['E', true],
  dropShadows: ['S', true],
  // options to enable feature
  debug: ['d', false],
  roundedCorners: ['r', false],
  // options with arguments
  encoding: ['e', 'utf-8'],
  scale: ['s', 1],
  tabSize: ['t', 0]
};
