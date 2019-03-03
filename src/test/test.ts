"use strict";
/*jshint eqnull:true */
/*jshint globalstrict:true */
/*jshint node:true */
/*eslint-env node*/
/* global describe */
/* global it */

import * as fs from 'fs';
import * as discrepances from "discrepances";
import { LineSplitter, EscapeCharsTransform, forEndOf } from "../..";

async function compareFiles(expectedFileName:string, obtainedFileName:string){
    var expected = await fs.promises.readFile(expectedFileName,'latin1');
    var obtained = await fs.promises.readFile(obtainedFileName,'latin1');
    discrepances.showAndThrow(obtained, expected);
}

describe('line-splitter', function(){
    it('pipe directly', async function(){
        var si = fs.createReadStream('src/test/fixtures/lines.txt', {encoding:'utf8'});
        var lineSplitter = new LineSplitter({encoding:'utf8'})
        var so = fs.createWriteStream('work/test/out-lines.txt', {encoding:'utf8'});
        si.pipe(lineSplitter).pipe(so);
        await forEndOf(so);
        await compareFiles('src/test/fixtures/lines.txt','work/test/out-lines.txt');
    });
    it('pipe row by row and escape', async function(){
        var si = fs.createReadStream('src/test/fixtures/lines.txt', {encoding:'utf8'});
        var lineSplitter = new LineSplitter({encoding:'utf8'})
        var escaper = new EscapeCharsTransform({charsToEscape:'{}', prefixChar:'\\'})
        var so = fs.createWriteStream('work/test/out-lines-escaped.txt', {encoding:'utf8'});
        await forEndOf(si.pipe(lineSplitter).pipe(escaper).pipe(so));
        await compareFiles('src/test/fixtures/lines-braces-escaped.txt','work/test/out-lines-escaped.txt');
    });
});
