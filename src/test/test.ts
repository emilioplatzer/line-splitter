"use strict";
/*jshint eqnull:true */
/*jshint globalstrict:true */
/*jshint node:true */
/*eslint-env node*/
/* global describe */
/* global it */

import * as fs from 'fs';
import * as discrepances from "discrepances";
import { LineSplitter, LineJoiner, EscapeCharsTransform, LineElement, streamSignalsDone } from "../..";
import { Readable, ReadableOptions, Transform, TransformCallback } from 'stream';

async function compareFiles(expectedFileName:string, obtainedFileName:string){
    var expected = await fs.promises.readFile(expectedFileName,'latin1');
    var obtained = await fs.promises.readFile(obtainedFileName,'latin1');
    discrepances.showAndThrow(obtained, expected);
}

describe('line-splitter', function(){
    it('pipe directly', async function(){
        var si = fs.createReadStream('src/test/fixtures/lines.txt', {encoding:'utf8'});
        var lineSplitter = new LineSplitter({})
        var lineJoiner = new LineJoiner({});
        var so = fs.createWriteStream('work/test/out-lines.txt', {encoding:'utf8'});
        si.pipe(lineSplitter).pipe(lineJoiner).pipe(so);
        await streamSignalsDone(so);
        await compareFiles('src/test/fixtures/lines.txt','work/test/out-lines.txt');
    });
    it('pipe row by row and escape', async function(){
        var si = fs.createReadStream('src/test/fixtures/lines.txt', {encoding:'utf8'});
        var lineSplitter = new LineSplitter({})
        var lineJoiner = new LineJoiner({});
        var escaper = new EscapeCharsTransform({charsToEscape:'{}', prefixChar:'\\'})
        var so = fs.createWriteStream('work/test/out-lines-escaped.txt', {encoding:'utf8'});
        await streamSignalsDone(si.pipe(lineSplitter).pipe(escaper).pipe(lineJoiner).pipe(so));
        await compareFiles('src/test/fixtures/lines-braces-escaped.txt','work/test/out-lines-escaped.txt');
    });
    class ReadFake extends Readable{
        private parts:string[];
        constructor(options:ReadableOptions & {parts:string[]}){
            var {parts, ...superOptions} = options;
            super({...superOptions});
            this.parts=parts;
        }
        _read(_size:number){
            var chunkString=this.parts.shift();
            if(chunkString==null){
                this.push(null);
            }else{
                var buf:Buffer = Buffer.from(chunkString);
                this.push(buf);
            }
        }
    }
    it('fake input to splitter LF', async function(){
        var si=new ReadFake({parts:[
            'media ','línea\n',
            'dos líneas\nque se mandaron juntas\n',
            'ahora',' van',' separadas',' por',' palabras\nmás',' o menos. Quizás\nmucho menos.', 
            '\nFin.'
        ]});
        var lineSplitter = new LineSplitter({})
        var lineJoiner = new LineJoiner({});
        var escaper = new EscapeCharsTransform({charsToEscape:'{}', prefixChar:'\\'})
        var so = fs.createWriteStream('work/test/out-fake1.txt');
        await streamSignalsDone(si.pipe(lineSplitter).pipe(escaper).pipe(lineJoiner).pipe(so));
        await compareFiles('src/test/fixtures/fake1.txt','work/test/out-fake1.txt');
    })
    it('fake input to splitter CRLF', async function(){
        var si=new ReadFake({parts:[
            'media ','línea\r\n',
            'dos líneas\r\nque se mandaron juntas\r',
            '\nahora',' van',' separadas',' por',' palabras\r\nmás',' o menos. Quizás\r\nmucho menos.', 
            '\r\nFin.'
        ]});
        var lineSplitter = new LineSplitter({})
        var lineJoiner = new LineJoiner({});
        var escaper = new EscapeCharsTransform({charsToEscape:'{}', prefixChar:'\\'})
        var so = fs.createWriteStream('work/test/out-fake1-cr.txt');
        await streamSignalsDone(si.pipe(lineSplitter).pipe(escaper).pipe(lineJoiner).pipe(so));
        await compareFiles('src/test/fixtures/fake1-cr.txt','work/test/out-fake1-cr.txt');
    })
    it('number lines', async function(){
        var si = fs.createReadStream('src/test/fixtures/lines.txt', {encoding:'utf8'});
        var lineSplitter = new LineSplitter({})
        var lineJoiner = new LineJoiner({});
        var myLineNumber=0;
        var numberLines = new Transform({
            objectMode:true,
            transform(chunk:LineElement, _encoding:string, next: TransformCallback) {
                myLineNumber=(myLineNumber||0)+1;
                this.push({line:myLineNumber+' '+chunk.line.toString('utf8'), eol:chunk.eol});
                next();
            }
        })
        var so = fs.createWriteStream('work/test/out-lines-numbered.txt', {encoding:'utf8'});
        await streamSignalsDone(si.pipe(lineSplitter).pipe(numberLines).pipe(lineJoiner).pipe(so));
        await compareFiles('src/test/fixtures/lines-numbered.txt','work/test/out-lines-numbered.txt');
    })
    it('number lines in file that ends with LF', async function(){
        var si = fs.createReadStream('src/test/fixtures/lines-lf.txt', {encoding:'utf8'});
        var lineSplitter = new LineSplitter({})
        var lineJoiner = new LineJoiner({});
        var myLineNumber=0;
        var numberLines = new Transform({
            objectMode:true,
            transform(chunk:LineElement, _encoding:string, next: TransformCallback) {
                myLineNumber=(myLineNumber||0)+1;
                this.push({line:myLineNumber+' '+chunk.line.toString('utf8'), eol:'\r\n'});
                next();
            }
        })
        var so = fs.createWriteStream('work/test/out-lines-lf-numbered.txt', {encoding:'utf8'});
        await streamSignalsDone(si.pipe(lineSplitter).pipe(numberLines).pipe(lineJoiner).pipe(so));
        await compareFiles('src/test/fixtures/lines-lf-numbered.txt','work/test/out-lines-lf-numbered.txt');
    })
});
