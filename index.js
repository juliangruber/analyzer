var Emitter = require('emitter');

module.exports = Analyzer;

/**
 * WebAudio analyzer.
 *
 * @param {Node} src
 * @return {Analyzer}
 * @api public
 */

function Analyzer(src) {
  this.analyzer = src.context.createAnalyser();
  this.smoothing(0);
  this.fftSize(2048);  
  var binCount = this.analyzer.frequencyBinCount;
  this.processor = src.context.createJavaScriptNode(binCount);
  this.processor.connect(src.context.destination);
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
 * Set the analyzer's `fftSize`.
 *
 * @param {Number fftSize}
 * @return {Analyzer}
 * @api public
 */

Analyzer.prototype.fftSize = function(fftSize) {
  if (fftSize <= 0 || fftSize % 2) {
    throw new TypeError('fftSize must be a positive power of 2');
  }
  this.analyzer.fftSize = fftSize;
  return this;
};

/**
 * Resume analyzing.
 *
 * @return {Analyzer}
 * @api public
 */

Analyzer.prototype.resume = function() {
  var self = this;
  self.running = true;
  self.processor.onaudioprocess = function() {
    if (!self.running) return self.processor.onaudioprocess = null;
    
    if (self.listeners('float frequency data').length) {
      var chunk = new Float32Array(self.analyzer.frequencyBinCount);
      self.analyzer.getFloatFrequencyData(chunk);
      self.emit('float frequency data', chunk);
    }
    
    if (self.listeners('byte frequency data').length) {
      var chunk = new Uint8Array(self.analyzer.frequencyBinCount);
      self.analyzer.getByteFrequencyData(chunk);
      self.emit('byte frequency data', chunk);
    }
    
    if (self.listeners('byte time domain data').length) {
      var chunk = new Uint8Array(self.analyzer.fftSize);
      self.analyzer.getByteTimeDomainData(chunk);
      self.emit('byte time domain data', chunk);
    }
  };
  
  return self;
};

/**
 * Pause analyzing.
 *
 * @return {Analyzer}
 * @api public
 */
 
Analyzer.prototype.pause = function() {
  this.running = false;
  return this;
};
