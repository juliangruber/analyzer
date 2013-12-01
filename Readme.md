
# analyzer

  A multi channel WebAudio analyzer that does all the nasty plumbing with `JavaScriptSourceNode`s and `AnalyzerNode`s for you.

## Example

  Analyze the input stream from your computer's microphone and log results to the console:

```js
var Analyzer = require('analyzer');
var AudioContext = window.audioContext || window.webkitAudioContext;

var context = new AudioContext();
var analyzer = Analyzer(context)
  .add('left', source, 0)
  .add('right', source, 1);

analyzer.on('float frequency data', function(chunk) {
  console.log('float frequency data', chunk);
  // { left: [ ... ], right: [ ... ] }
});
```

## Installation

  Install with [component(1)](http://component.io):

```bash
$ component install juliangruber/analyzer
```

## API

### Analyzer([opts, ]ctx)

  Create a new `Analyzer` for the WebAudio `context`. Inherits from [component/emitter](https://github.com/component/emitter).

  Possible options:
  
  * `smoothing`: The smoothing time constant, can be between 0 and 1.

### Analyzer#add(name, node[, channel])

  Start analyzing `node` and expose it in events under `name`. `channel` is the output channel you care about and defaults to `0`.

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
