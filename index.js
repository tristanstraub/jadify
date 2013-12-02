(function() {
  var compileJade, fs, jade, nconf, path, through;

  path = require('path');

  fs = require('fs');

  through = require('through');

  jade = require('jade');

  module.exports = function(file) {
    var end, inputString, write;
    if (!/\.jade$/.test(file)) {
      return through();
    }
    inputString = '';
    write = function(buf) {
      return inputString += buf;
    };
    end = function() {
      this.queue(compileJade(inputString, file));
      return this.queue(null);
    };
    return through(write, end);
  };

  compileJade = function(inputString, file) {
    var templateFunction;
    templateFunction = jade.compile(inputString, {
      client: true,
      filename: file,
      compileDebug: false
    });
    return "var jade = require('jade/lib/runtime.js'); module.exports=" + templateFunction + ";";
  };

})();
