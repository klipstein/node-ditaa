var ditaa = require('../index.js');
var execJar = require('../exec.js');
var execNodeJava = require('../node_java.js');
var fs = require('fs');
var path = require('path');

describe('ditaa', function() {

  var pngMagicNumber = '89504e47';

  it('returns a PNG image', function(done) {
    ditaa('-', function(err, data) {
      expect(data.toString('hex', 0, 4)).toBe(pngMagicNumber);
      done();
    });
  });
  
  it('returns an PNG image, if "null" was passed', function(done) {
    ditaa(null, function(err, data) {
      expect(data.toString('hex', 0, 4)).toBe(pngMagicNumber);
      done();
    });
  });

  it('returns an error, if a non-valid ascii-graph-string was passed', function(done) {
    ditaa('', function(err, data) {
      expect(err).toBeTruthy();
      done();
    });
  });

  it('handles a simple ditaa ascii graph', function(done) {
    var graph = [
      '+-----+',
      '|     |',
      '+-----+'
    ].join('\n');
    var simplePng = fs.readFileSync(path.join(__dirname, 'simple.png'));
    ditaa(graph, function(err, data) {
      expect(data.toString()).toBe(simplePng.toString());
      done();
    });
  });

  it('handles a complex ditaa ascii graph', function(done) {
    var graph = [
      '+--------+   +-------+    +-------+',
      '|        | --+ ditaa +--> |       |',
      '|  Text  |   +-------+    |diagram|',
      '|Document|   |!magic!|    |       |',
      '|     {d}|   |       |    |       |',
      '+---+----+   +-------+    +-------+',
      '    :                         ^',
      '    |       Lots of work      |',
      '    +-------------------------+'
    ].join('\n');
    var complexPng = fs.readFileSync(path.join(__dirname, 'complex.png'));
    ditaa(graph, function(err, data) {
      expect(data.toString()).toBe(complexPng.toString());
      done();
    });
  });

  var simpleOptionsGraph = [
    '\t+-----+',
    '\t|     |',
    '\t+-----+'
  ].join('\n');
  var simpleOptions = {
    antialias: false,
    dropShadows: false,
    debug: true,
    encoding: 'utf-8',
    roundedCorners: true,
    scale: 5,
    separationOfCommonEdges: false,
    tabSize: 8
  };

  it('allows to pass ditaa options as second parameter', function(done) {
    var simplePngWithOptions = fs.readFileSync(path.join(__dirname, 'simple_options.png'));
    ditaa(simpleOptionsGraph, simpleOptions, function(err, data) {
      expect(data.toString()).toBe(simplePngWithOptions.toString());
      done();
    });
  });

  describe('ditaa#enableJavaExec', function() {
    it('enables executing ditaa via commandline (slow)', function(done) {
      ditaa.enableJavaExec();
      var simplePngWithOptions = fs.readFileSync(path.join(__dirname, 'simple_options.png'));
      ditaa(simpleOptionsGraph, simpleOptions, function(err, data) {
        expect(data.toString()).toBe(simplePngWithOptions.toString());
        ditaa.disableJavaExec();
        done();
      });
    });
  });

  describe('exec#prepareOptions', function() {
    it('prepares "no"-options when option-value is false', function() {
      var options = {
        antialias: false,
        dropShadows: true,
        separationOfCommonEdges: false
      };
      var preparedOptions = execJar.prepareOptions(options, ditaa.defaultOptions);
      expect(preparedOptions).toEqual([
        '-A',
        '-E'
      ]);
    });
    it('adds options when option-value is true', function() {
      var options = {
        debug: false,
        roundedCorners: true
      };
      var preparedOptions = execJar.prepareOptions(options, ditaa.defaultOptions);
      expect(preparedOptions).toEqual(['-r']);
    });
    it('adds options with arguments', function() {
      var options = {
        encoding: 'ISO-8859-1',
        scale: 10,
        tabSize: 8
      };
      var preparedOptions = execJar.prepareOptions(options, ditaa.defaultOptions);
      expect(preparedOptions).toEqual([
        '-e ISO-8859-1',
        '-s 10',
        '-t 8'
      ]);
    });
  });

  describe('node_java#prepareOptions', function() {
    it('returns default options when no options where passed', function() {
      var preparedOptions = execNodeJava.prepareOptions(null, ditaa.defaultOptions);
      expect(preparedOptions).toEqual({
        antialias: true,
        dropShadows: true,
        debug: false,
        encoding: 'utf-8',
        roundedCorners: false,
        scale: 1,
        separationOfCommonEdges: true,
        tabSize: 0
      });
    });
    it('mixes options into default options', function() {
      var preparedOptions = execNodeJava.prepareOptions({
        antialias: false,
        dropShadows: false,
        debug: true,
        encoding: 'ISO-8859-1',
        roundedCorners: true,
        scale: 10,
        separationOfCommonEdges: false,
        tabSize: 10
      }, ditaa.defaultOptions);
      expect(preparedOptions).toEqual({
        antialias: false,
        dropShadows: false,
        debug: true,
        encoding: 'ISO-8859-1',
        roundedCorners: true,
        scale: 10,
        separationOfCommonEdges: false,
        tabSize: 10
      });
    });
  });

});
