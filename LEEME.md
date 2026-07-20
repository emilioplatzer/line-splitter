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

El objetivo de `line-splitter` es procesar un stream línea por línea y que las
líneas se vuelvan a juntar **en el mismo orden en que se separaron**. Si el
transformador intermedio procesa de a una línea por vez —aunque cada línea
implique trabajo asincrónico, como insertarla en una base de datos y esperar el
id generado— el orden de salida está garantizado.

Lo que no preserva el orden es paralelizar por cuenta propia (aceptar varias
líneas a la vez y emitir cada respuesta a medida que llega). Para procesar en
paralelo sin perder el orden se puede intercalar
[parallel-transform](https://www.npmjs.com/package/parallel-transform), que
mantiene una ventana de N transformaciones en vuelo y emite en orden.

<!-- Pendiente (julio 2026): parallel-transform (mafintosh) está abandonado (npm 1.2.0 de 2019)
y tiene bugs conocidos con arreglos sin mergear: PR #6 (usar _final en vez de _flush; arregla
los issues #4 y #11, el finish prematuro / cuelgue al final del pipeline) y PR #10 (manejo de
undefined). Más adelante: aplicar esos dos PRs en el fork emilioplatzer/parallel-transform y
publicarlo (u otro nombre, o dependencia git), o cambiar la mención de arriba por pipeline-pipe
(reescritura TS publicada en npm, 0.3.0 de 2021, también dormida). Ojo con el fork de Marko298:
su fix tiene una errata (this.ondrain sin guion bajo). -->

<!--lang:en--]

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

[!--lang:es-->

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
