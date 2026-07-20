# line-splitter

Transform stream for line splitting


[![npm-version](https://img.shields.io/npm/v/line-splitter.svg)](https://npmjs.org/package/line-splitter)
[![downloads](https://img.shields.io/npm/dm/line-splitter.svg)](https://npmjs.org/package/line-splitter)
[![linux](https://github.com/emilioplatzer/line-splitter/actions/workflows/build-and-test.yml/badge.svg)](https://github.com/emilioplatzer/line-splitter/actions/workflows/build-and-test.yml)
[![windows](https://ci.appveyor.com/api/projects/status/github/emilioplatzer/line-splitter?svg=true)](https://ci.appveyor.com/project/emilioplatzer/line-splitter)
[![coverage](https://img.shields.io/coveralls/emilioplatzer/line-splitter/master.svg)](https://coveralls.io/r/emilioplatzer/line-splitter)
[![security](https://socket.dev/api/badge/npm/package/line-splitter)](https://socket.dev/npm/package/line-splitter)
[![qa-control](https://github.com/emilioplatzer/line-splitter/actions/workflows/qa-control.yml/badge.svg)](https://github.com/emilioplatzer/line-splitter/actions/workflows/qa-control.yml)


language: ![English](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-en.png)
also available in:
[![Spanish](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-es.png)](LEEME.md)


The goal of `line-splitter` is to process a stream line by line and get the
lines joined back **in the same order they were split**. If the intermediate
transform processes one line at a time —even when each line involves
asynchronous work, like inserting it into a database and waiting for the
generated id— the output order is guaranteed.

What does not preserve the order is rolling your own parallelization (accepting
several lines at once and pushing each response as it arrives). To process in
parallel without losing the order you can pipe through
[parallel-transform](https://www.npmjs.com/package/parallel-transform), which
keeps a window of N in-flight transforms and emits in order.


## Install


```sh
$ npm install line-splitter
```


## Usage


An example that numbers the lines of a file:


```js
const fs = require('fs');
const { Transform } = require('stream');
const { LineSplitter, LineJoiner, streamSignalsDone } = require('line-splitter');

async function numberLines(inputFileName, outputFileName){
    let lineNumber = 0;
    const numberer = new Transform({
        objectMode: true,
        transform(chunk, _encoding, next){
            lineNumber++;
            this.push({line: lineNumber + ' ' + chunk.line.toString('utf8'), eol: chunk.eol});
            next();
        }
    });
    const output = fs.createWriteStream(outputFileName);
    fs.createReadStream(inputFileName)
        .pipe(new LineSplitter({}))
        .pipe(numberer)
        .pipe(new LineJoiner({}))
        .pipe(output);
    await streamSignalsDone(output);
}
```

## API

### new LineSplitter(options)


Transform stream that receives `Buffer`s (or strings) and pushes, in object mode,
one `LineElement` per line: `{line:Buffer, eol:Buffer}`. It recognizes `\n` and
`\r\n` line endings (`eol` keeps which one it was). If the input does not end with
a line ending, the last line comes out with an empty `eol`.


### new LineJoiner(options)


The inverse transform: receives `LineElement`s in object mode and pushes the bytes
of each line followed by its `eol`.


### new EscapeCharsTransform({charsToEscape, prefixChar}, mode)


Prefixes each occurrence of the characters in `charsToEscape` with `prefixChar`.
Without `mode` it works directly on `Buffer`s; with `mode: 'lines'` it works in
object mode on `LineElement`s (escaping the `line` part).


### streamSignalsDone(stream)


Returns a promise that resolves when the stream emits `close`, `end` or `finish`,
and rejects if it emits `error`.


## License


[MIT](LICENSE)
