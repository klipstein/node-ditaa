var fs = require('fs');
var java = require('java');
var os = require('os');
var path = require('path');

java.options.push('-Djava.awt.headless=true');
java.classpath.push(path.join(__dirname, 'vendor', 'ditaa-0.9', 'ditaa.jar'));
java.classpath.push(path.join(__dirname, 'vendor', 'ditaa-0.9', 'commons-cli-1.2.jar'));

var BasicParser = java.import('org.apache.commons.cli.BasicParser');
var BitmapRenderer = java.import('org.stathissideris.ascii2image.graphics.BitmapRenderer');
var ConversionOptions = java.import('org.stathissideris.ascii2image.core.ConversionOptions');
var Diagram = java.import('org.stathissideris.ascii2image.graphics.Diagram');
var FileOutputStream = java.import('java.io.FileOutputStream');
var ImageIO = java.import('javax.imageio.ImageIO');
var Options = java.import('org.apache.commons.cli.Options');
var PrintStream = java.import('java.io.PrintStream');
var System = java.import('java.lang.System');
var TextGrid = java.import('org.stathissideris.ascii2image.text.TextGrid');

var isWindows = os.platform() === 'win32';
var nullString = java.newInstanceSync('java.lang.String', (isWindows ? 'NUL:' : '/dev/null'));
var originalPrintStream = new PrintStream(System.out);
var nullPrintStream = new PrintStream(new FileOutputStream(nullString));

var setConversionOptions = function(conversionOptions, options) {
  var pOptions = conversionOptions.processingOptions;
  var rOptions = conversionOptions.renderingOptions;
  pOptions.setAllCornersAreRound(options.roundedCorners);
  pOptions.setCharacterEncoding(
    java.newInstanceSync("java.lang.String", options.encoding)
  );
  pOptions.setPerformSeparationOfCommonEdges(options.separationOfCommonEdges);
  pOptions.setTabSize(options.tabSize);
  
  rOptions.setRenderDebugLines(options.debug);

  rOptions.setDropShadowsSync(options.dropShadows);
  rOptions.setAntialias(options.antialias);
  rOptions.setScale(options.scale);
};

module.exports = function(inFile, outFile, options, callback) {

  var diagram;
  var grid = new TextGrid();
  var cmdLineOptions = new Options();
  var cmdLineParser = new BasicParser();
  var stringArray = java.newArray('java.lang.String', []);
  var cmdLine = cmdLineParser.parseSync(cmdLineOptions, stringArray);
  var conversionOptions = new ConversionOptions(cmdLine);

  setConversionOptions(conversionOptions, options);

  var inFileString = java.newInstanceSync("java.lang.String", inFile.path);
  var outFileStream = new FileOutputStream(outFile.path);

  grid.loadFrom(inFileString, conversionOptions.processingOptions, function(err) {
    if (err) return callback(err);
    System.setOutSync(nullPrintStream); // avoid System.out.println to print to console
    diagram = new Diagram(grid, conversionOptions);
    System.setOutSync(originalPrintStream); // reset to previous original stream
    new BitmapRenderer().renderToImage(diagram, conversionOptions.renderingOptions, function(err, image) {
      if (err) return callback(err);
      ImageIO.write(image, 'png', outFileStream, function(err) {
        if (err) return callback(err);
        fs.readFile(outFile.path, callback);
      });
    });
  });

};

module.exports.prepareOptions = function(options, defaultOptions) {
  options = options ? options : {};
  var ret = {};
  for (var key in defaultOptions) {
    ret[key] = typeof options[key] !== 'undefined' ? options[key] : defaultOptions[key][1]
  }
  return ret;
};
