var ditaa = require('../index.js');
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

});
