var Emitter = require('emitter');

module.exports = Analyzer;

/**
 * WebAudio analyzer.
 *
 * @return {Analyzer}
 * @api public
 */

function Analyzer(src) {
  this.ctx = src.context;
  this.analyzer = this.ctx.createAnalyser();
  this.analyzer.fftSize = 2048;
  this.processor = this.ctx.createJavaScriptNode(1024);
  this.analyzer.connect(this.processor);
  this.processor.connect(this.ctx.destination);
  
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
