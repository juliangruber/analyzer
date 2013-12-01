
# analyzer

  A WebAudio analyzer that does all the nasty plumbing with `JavaScriptSourceNode`s and `AnalyzerNode`s for you.

## Example

  Analyze the input stream from your computer's microphone and log results to the console:

```js
var Analyzer = require('analyzer');
var AudioContext = window.audioContext || window.webkitAudioContext;

var context = new AudioContext();
var analyzer = new Analyzer(context);

sourceNode.connect(analyzer.node);

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

### Analyzer(ctx)

  Create a new `Analyzer` for the WebAudio `context`. Inherits from [component/emitter](https://github.com/component/emitter).

### Analyzer#node

The AudioNode that you need to connect the node you want to analyze to.

### Analyzer#smoothing(amount)

  Set the smoothing time constant to `amount` which must be an integer from `0` to `1`. The bigger, the more smoothing. `0` disables smoothing completely. Defaults to `0`.

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
