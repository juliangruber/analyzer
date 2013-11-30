
# analyzer

  A WebAudio analyzer that does all the nasty plumbing with `JavaScriptSourceNode`s and `AnalyzerNode`s for you.

## Example

  Analyze the input stream from your computer's microphone and log results to the console:

```js
var Analyzer = require('analyzer');

var analyzer = new Analyzer(sourceNode);

analyzer.on('float frequency data', function(chunk) {
  console.log('float frequency data', chunk);
});
```

## Installation

  Install with [component(1)](http://component.io):

```bash
$ component install juliangruber/analyzer
```

## API

### Analyzer(source)

  Create a new `Analyzer` for the `source` node. Inherits from [component/emitter](https://github.com/component/emitter).

### Analyzer#smoothing(amount)

  Set the smoothing time constant to `amount` which must be an integer from `0` to `1`. The bigger, the more smoothing. `0` disables smoothing completely. Defaults to `0`.

### Analyzer#fftSize(size)

  Set the internal `fftSize` which controls how many samples are processed at a time. Must be a positive power of 2. Defaults to `2048`.

### Analyzer#resume()

  Resume analyzing.

### Analyzer#pause()

  Pause analyzing.

### Analyzer#on('float frequency data', fn)

  Call `fn` with a `Float32Array(fftSize / 2)` for each new chunk.

### Analyzer#on('byte frequency data', fn)

  Call `fn` with a `Uint8Array(fftSize / 2)` for each new chunk.

### Analyzer#on('byte time domain data', fn)

  Call `fn` with a `Float32Array(fftSize)` for each new chunk.

## License

  MIT
