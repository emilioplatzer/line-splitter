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
        if(this.internalBuffer.length && this.internalBuffer.find(x=>x.length>0 || x.byteLength>0)){
            this.push({line:Buffer.concat(this.internalBuffer), eol:Buffer.from('')});
        }
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

export type EscapeCharsTransformMode='lines';
export type EscapeCharsTransformOptions={charsToEscape:string, prefixChar:string} & TransformOptions;

export class EscapeCharsTransform extends Transform {
    private charsMap:{[key:string]: true};
    private prefixBuffer:Buffer;
    private mode:EscapeCharsTransformMode|undefined;
    constructor(options:EscapeCharsTransformOptions, mode?:EscapeCharsTransformMode) {
        var {charsToEscape, prefixChar, ...superOptions} = options;
        super({objectMode:mode==='lines', ...superOptions});
        this.prefixBuffer=Buffer.alloc(1,prefixChar);
        this.charsMap={};
        this.mode=mode;
        var self=this;
        charsToEscape.split('').forEach(function(char){
            var ascii:number=char.charCodeAt(0);
            self.charsMap[ascii]=true;
        })
    }
    _transform(chunk:LineElement|Buffer, _encoding:string, next:TransformCallback){
        var index=0;
        var pos=0;
        var line:Buffer;
        var parts:{push:(part:Buffer)=>void};
        if(this.mode === 'lines'){
            parts=[] as Buffer[];
            line=(chunk as LineElement).line;
        }else{
            parts=this;
            line=chunk as Buffer;
        }
        while(pos<line.byteLength){
            if(this.charsMap[line[pos]]){
                parts.push(line.slice(index,pos));
                parts.push(this.prefixBuffer);
                index=pos;
            }
            pos++;
        }
        parts.push(line.slice(index));
        if(this.mode === 'lines'){
            this.push({line:Buffer.concat(parts as Buffer[]), eol:(chunk as LineElement).eol})
        }
        next();
    }
}

export async function streamSignalsDone(stream:Stream):Promise<void>{
    return new Promise(function(resolve, reject){
        stream.on('error', reject );
        stream.on('close', resolve);
        stream.on('end',   resolve);
        stream.on('finish',resolve);
    });
}
