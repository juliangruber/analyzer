var Emitter = require('emitter');

module.exports = Analyzer;

/**
 * WebAudio analyzer.
 *
 * @param {Context} ctx
 * @return {Analyzer}
 * @api public
 */

function Analyzer(ctx, opts) {
  if (!(this instanceof Analyzer)) return new Analyzer(ctx, opts);
  if (!opts) opts = {};
  this.ctx = ctx;
  this.processor = ctx.createJavaScriptNode(1024);
  this.processor.onaudioprocess = this.process.bind(this);
  this.analyzers = {};
  this.smoothing = opts.smoothing || 0;
  this.resume();
}

Emitter(Analyzer.prototype);

/**
 * Analyze `node`.
 *
 * @param {String} name
 * @param {AudioNode} node
 * @param {Number=} channel
 * @return {Analyzer}
 * @api public
 */

Analyzer.prototype.add = function(name, node, channel) {
  var analyzer = this.ctx.createAnalyser();
  analyzer.fftSize = 2048;
  analyzer.smoothingTimeConstant = this.smoothing;
  
  if (Object.keys(this.analyzers).length == 0) node.connect(this.processor);
  node.connect(analyzer, channel || 0);
  
  this.analyzers[name] = analyzer;
  
  return this;
};

/**
 * Resume analyzing.
 *
 * @return {Analyzer}
 * @api public
 */

Analyzer.prototype.resume = function() {
  this.processor.connect(this.ctx.destination);
  return this;
};

/**
 * Pause analyzing.
 *
 * @return {Analyzer}
 * @api public
 */

Analyzer.prototype.pause = function() {
  this.processor.disconnect();
  return this;  
};

/**
 * Onaudioprocess callback.
 *
 * @api private
 */

Analyzer.prototype.process = function() {
  var analyzers = this.analyzers;
  
  if (this.listeners('float frequency data').length) {
    var channels = {};
    each(analyzers, function(analyzer, name) {
      var chunk = new Float32Array(analyzer.frequencyBinCount);
      analyzer.getFloatFrequencyData(chunk);
      channels[name] = chunk;
    });
    this.emit('float frequency data', channels);
  }
  
  if (this.listeners('byte frequency data').length) {
    var channels = {};
    each(analyzers, function(analyzer, name) {
      var chunk = new Uint8Array(analyzer.frequencyBinCount);
      analyzer.getByteFrequencyData(chunk);
      channels[name] = chunk;
    });
    this.emit('byte frequency data', channels);
  }

  if (this.listeners('byte time domain data').length) {
    var channels = {};
    each(analyzers, function(analyzer, name) {
      var chunk = new Uint8Array(analyzer.fftSize);
      analyzer.getByteTimeDomainData(chunk);
      channels[name] = chunk;
    });
    this.emit('byte time domain data', channels);
  }
};

/**
 * Object iteration utility.
 *
 * @param {Object} obj
 * @param {Function} fn
 * @api private
 */

function each(obj, fn) {
  Object.keys(obj).forEach(function(key) {
    fn(obj[key], key);
  });
}
