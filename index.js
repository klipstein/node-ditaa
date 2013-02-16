var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');
var TempFile = require('temporary/lib/file');

module.exports = function(graphString, callback) {
  var inFile = new TempFile();
  var outFile = new TempFile();
  inFile.writeFileSync(graphString);
  var cmd = [
    'java',
    '-jar',
    path.join(__dirname, 'vendor', 'ditaa-0.9', 'ditaa.jar'),
    inFile.path,
    outFile.path
  ].join(' ');
  exec(cmd, function(error, stdout, stderr) {
    if (error != null) {
      callback(error);
    } else {
      fs.readFile(outFile.path, callback);
      inFile.unlink();
      outFile.unlink();
    }
  });
};
