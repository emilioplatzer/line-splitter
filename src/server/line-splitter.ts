"use strict";

import { Transform, TransformCallback, TransformOptions, Stream } from "stream"

export class LineSplitter extends Transform {
    private internalBuffer:Buffer|null=null;
    constructor(options:TransformOptions) {
        super(options);
    }
    _transform(chunk:Buffer, _encoding:string, next:TransformCallback){
        var index=0;
        var pos:number;
        var buf2Send:Buffer;
        while((pos=chunk.indexOf(10,index))!=-1){
            if(this.internalBuffer){
                chunk.copy(this.internalBuffer,this.internalBuffer.byteLength,index,pos+1);
                buf2Send=this.internalBuffer;
                this.internalBuffer=null;
            }else{
                buf2Send=chunk.slice(index,pos+1);
            }
            this.push(buf2Send);
            index=pos+1;
        }
        this.internalBuffer = chunk.slice(index);
        next();
    }
    _flush(done:TransformCallback){
        this.push(this.internalBuffer);
        done();
    }
}          

export type EscapeCharsTransformOptions={charsToEscape:string, prefixChar:string} & TransformOptions;

export class EscapeCharsTransform extends Transform {
    private charsMap:{[key:string]: true};
    private prefixBuffer:Buffer;
    constructor(options:EscapeCharsTransformOptions) {
        var {charsToEscape, prefixChar, ...superOptions} = options;
        super(superOptions);
        this.prefixBuffer=Buffer.alloc(1,prefixChar);
        this.charsMap={};
        var self=this;
        charsToEscape.split('').forEach(function(char){
            var ascii:number=char.charCodeAt(0);
            self.charsMap[ascii]=true;
        })
    }
    _transform(chunk:Buffer, _encoding:string, next:TransformCallback){
        var index=0;
        var pos=0;
        while(pos<chunk.byteLength){
            if(this.charsMap[chunk[pos]]){
                this.push(chunk.slice(index, pos));
                this.push(this.prefixBuffer);
                index=pos;
            }
            pos++;
        }
        this.push(chunk.slice(index));
        next();
    }
}

export async function forEndOf(stream:Stream):Promise<void>{
    return new Promise(function(resolve, reject){
        stream.on('error', reject);
        stream.on('close', resolve)
    });
}
