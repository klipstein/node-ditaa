var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');

module.exports = function(inFile, outFile, options, callback) {
  var cmd = [
    'java',
    '-jar',
    path.join(__dirname, 'vendor', 'ditaa-0.9', 'ditaa.jar'),
    inFile.path,
    outFile.path
  ].concat(options).join(' ');
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

module.exports.prepareOptions = function(options, defaultOptions) {
  var ret = [];
  var defaultOption, isUpperCase, isLowerCase, option;
  for (var key in options) {
    option = options[key];
    defaultOption = defaultOptions[key];
    isUpperCase = defaultOption[0].toUpperCase() === defaultOption[0];
    isLowerCase = defaultOption[0].toLowerCase() === defaultOption[0]
    if (defaultOption) {
      // cmdline params to disable a feature
      if (isUpperCase && !option) {
        ret.push('-' + defaultOption[0]);
      // cmdline params to enable a feature
      } else if (isLowerCase && typeof defaultOption[1] === 'boolean' && option) {
        ret.push('-' + defaultOption[0]);
      // cmdline params with arguments
      } else if (isLowerCase && typeof defaultOption[1] !== 'boolean') {
        ret.push('-' + defaultOption[0] + ' ' + option);
      }
    }
  }
  return ret;
};
