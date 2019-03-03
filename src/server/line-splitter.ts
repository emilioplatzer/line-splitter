"use strict";

import { Transform, TransformCallback, TransformOptions, Stream } from "stream"

export type LineElement = {line:Buffer, eol:Buffer};

export class LineSplitter extends Transform {
    private internalBuffer:Buffer[]=[];
    private eol13=Buffer.from('\r\n');
    private eol10=Buffer.from('\n');
    constructor(options:TransformOptions) {
        super({readableObjectMode:true, ...options});
    }
    _transform(chunk:Buffer, _encoding:string, next:TransformCallback){
        var index=0;
        var pos:number;
        while((pos=chunk.indexOf(10,index))!=-1){
            var with13 = pos && chunk[pos-1]==13;
            this.push({line:Buffer.concat([...this.internalBuffer, chunk.slice(index,pos-(with13?1:0))]), eol:with13?this.eol13:this.eol10})
            this.internalBuffer=[];
            index=pos+1;
        }
        this.internalBuffer.push(chunk.slice(index));
        next();
    }
    _flush(done:TransformCallback){
        this.push({line:Buffer.concat(this.internalBuffer), eol:Buffer.from('')});
        done();
    }
}          

export class LineJoiner extends Transform {
    constructor(options:TransformOptions) {
        super({writableObjectMode:true, ...options});
    }
    _transform(chunk:LineElement, _encoding:string, next:TransformCallback){
        this.push(chunk.line);
        this.push(chunk.eol);
        next();
    }
}          

export type EscapeCharsTransformOptions={charsToEscape:string, prefixChar:string} & TransformOptions;

export class EscapeCharsTransform extends Transform {
    private charsMap:{[key:string]: true};
    private prefixBuffer:Buffer;
    constructor(options:EscapeCharsTransformOptions) {
        var {charsToEscape, prefixChar, ...superOptions} = options;
        super({objectMode:true, ...superOptions});
        this.prefixBuffer=Buffer.alloc(1,prefixChar);
        this.charsMap={};
        var self=this;
        charsToEscape.split('').forEach(function(char){
            var ascii:number=char.charCodeAt(0);
            self.charsMap[ascii]=true;
        })
    }
    _transform(chunk:LineElement, _encoding:string, next:TransformCallback){
        var index=0;
        var pos=0;
        var parts:Buffer[]=[];
        while(pos<chunk.line.byteLength){
            if(this.charsMap[chunk.line[pos]]){
                parts.push(chunk.line.slice(index,pos));
                parts.push(this.prefixBuffer);
                index=pos;
            }
            pos++;
        }
        parts.push(chunk.line.slice(index));
        this.push({line:Buffer.concat(parts), eol:chunk.eol})
        next();
    }
}

export async function streamSignalsClose(stream:Stream):Promise<void>{
    return new Promise(function(resolve, reject){
        stream.on('error', reject);
        stream.on('close', resolve)
    });
}
