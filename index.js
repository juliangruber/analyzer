var Emitter = require('emitter');

module.exports = Analyzer;

/**
 * WebAudio analyzer.
 *
 * @param {Context} ctx
 * @return {Analyzer}
 * @api public
 */

function Analyzer(ctx) {
  this.ctx = ctx;
  this.analyzer = ctx.createAnalyser();
  this.analyzer.fftSize = 2048;
  this.processor = ctx.createJavaScriptNode(1024);
  this.processor.onaudioprocess = this.process.bind(this);
  this.node = this.analyzer;
  this.smoothing(0);
  this.resume();
}

Emitter(Analyzer.prototype);

/**
 * Set the smoothing time constant to `amount`,
 * which must be between 0 and 1.
 *
 * @param {Number} amount
 * @return {Analyzer}
 * @api public
 */

Analyzer.prototype.smoothing = function(amount) {
  if (amount < 0 || amount > 1) {
    throw new TypeError('amount must be between 0 and 1');
  }
  this.analyzer.smoothingTimeConstant = amount;
  return this;
};

/**
 * Resume analyzing.
 *
 * @return {Analyzer}
 * @api public
 */

Analyzer.prototype.resume = function() {
  this.analyzer.connect(this.processor);
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
  this.analyzer.disconnect();
  this.processor.disconnect();
  return this;  
};

/**
 * Onaudioprocess callback.
 *
 * @api private
 */

Analyzer.prototype.process = function() {
  if (this.listeners('float frequency data').length) {
    var chunk = new Float32Array(this.analyzer.frequencyBinCount);
    this.analyzer.getFloatFrequencyData(chunk);
    this.emit('float frequency data', chunk);
  }
  
  if (this.listeners('byte frequency data').length) {
    var chunk = new Uint8Array(this.analyzer.frequencyBinCount);
    this.analyzer.getByteFrequencyData(chunk);
    this.emit('byte frequency data', chunk);
  }
  
  if (this.listeners('byte time domain data').length) {
    var chunk = new Uint8Array(this.analyzer.fftSize);
    this.analyzer.getByteTimeDomainData(chunk);
    this.emit('byte time domain data', chunk);
  }
};
