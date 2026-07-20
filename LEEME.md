<!--multilang v0 es:LEEME.md en:README.md -->
# line-splitter
<!--lang:es-->

Stream de transformación para separar líneas

<!--lang:en--]

Transform stream for line splitting

[!--lang:*-->

<!-- cucardas -->
[![npm-version](https://img.shields.io/npm/v/line-splitter.svg)](https://npmjs.org/package/line-splitter)
[![downloads](https://img.shields.io/npm/dm/line-splitter.svg)](https://npmjs.org/package/line-splitter)
[![linux](https://github.com/emilioplatzer/line-splitter/actions/workflows/build-and-test.yml/badge.svg)](https://github.com/emilioplatzer/line-splitter/actions/workflows/build-and-test.yml)
[![windows](https://ci.appveyor.com/api/projects/status/github/emilioplatzer/line-splitter?svg=true)](https://ci.appveyor.com/project/emilioplatzer/line-splitter)
[![coverage](https://img.shields.io/coveralls/emilioplatzer/line-splitter/master.svg)](https://coveralls.io/r/emilioplatzer/line-splitter)
[![security](https://socket.dev/api/badge/npm/package/line-splitter)](https://socket.dev/npm/package/line-splitter)
[![qa-control](https://github.com/emilioplatzer/line-splitter/actions/workflows/qa-control.yml/badge.svg)](https://github.com/emilioplatzer/line-splitter/actions/workflows/qa-control.yml)

<!--multilang buttons-->

idioma: ![castellano](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-es.png)
también disponible en:
[![inglés](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-en.png)](README.md)

<!--lang:es-->

## Instalación

<!--lang:en--]

## Install

[!--lang:*-->

```sh
$ npm install line-splitter
```

<!--lang:es-->

## Uso

<!--lang:en--]

## Usage

[!--lang:es-->

Un ejemplo que numera las líneas de un archivo:

<!--lang:en--]

An example that numbers the lines of a file:

[!--lang:*-->

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

<!--lang:es-->

Stream de transformación que recibe `Buffer`s (o strings) y emite, en modo objeto,
un `LineElement` por cada línea: `{line:Buffer, eol:Buffer}`. Reconoce los fines de
línea `\n` y `\r\n` (`eol` conserva cuál era). Si la entrada no termina en fin de
línea, la última línea sale con `eol` vacío.

<!--lang:en--]

Transform stream that receives `Buffer`s (or strings) and pushes, in object mode,
one `LineElement` per line: `{line:Buffer, eol:Buffer}`. It recognizes `\n` and
`\r\n` line endings (`eol` keeps which one it was). If the input does not end with
a line ending, the last line comes out with an empty `eol`.

[!--lang:*-->

### new LineJoiner(options)

<!--lang:es-->

La transformación inversa: recibe `LineElement`s en modo objeto y emite los bytes
de cada línea seguidos de su `eol`.

<!--lang:en--]

The inverse transform: receives `LineElement`s in object mode and pushes the bytes
of each line followed by its `eol`.

[!--lang:*-->

### new EscapeCharsTransform({charsToEscape, prefixChar}, mode)

<!--lang:es-->

Antepone `prefixChar` a cada aparición de los caracteres de `charsToEscape`.
Sin `mode` opera directamente sobre `Buffer`s; con `mode: 'lines'` opera en modo
objeto sobre `LineElement`s (escapa la parte `line`).

<!--lang:en--]

Prefixes each occurrence of the characters in `charsToEscape` with `prefixChar`.
Without `mode` it works directly on `Buffer`s; with `mode: 'lines'` it works in
object mode on `LineElement`s (escaping the `line` part).

[!--lang:*-->

### streamSignalsDone(stream)

<!--lang:es-->

Devuelve una promesa que se resuelve cuando el stream emite `close`, `end` o
`finish`, y se rechaza si emite `error`.

<!--lang:en--]

Returns a promise that resolves when the stream emits `close`, `end` or `finish`,
and rejects if it emits `error`.

[!--lang:es-->

## Licencia

<!--lang:en--]

## License

[!--lang:*-->

[MIT](LICENSE)
