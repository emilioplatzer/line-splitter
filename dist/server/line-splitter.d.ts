import { Transform, TransformCallback, TransformOptions, Stream } from "stream";
export type LineElement = {
    line: Buffer;
    eol: Buffer;
};
export declare class LineSplitter extends Transform {
    private internalBuffer;
    private eol13;
    private eol10;
    constructor(options: TransformOptions);
    _transform(chunk: Buffer, _encoding: string, next: TransformCallback): void;
    _flush(done: TransformCallback): void;
}
export declare class LineJoiner extends Transform {
    constructor(options: TransformOptions);
    _transform(chunk: LineElement, _encoding: string, next: TransformCallback): void;
}
export type EscapeCharsTransformMode = 'lines';
export type EscapeCharsTransformOptions = {
    charsToEscape: string;
    prefixChar: string;
} & TransformOptions;
export declare class EscapeCharsTransform extends Transform {
    private charsMap;
    private prefixBuffer;
    private mode;
    constructor(options: EscapeCharsTransformOptions, mode?: EscapeCharsTransformMode);
    _transform(chunk: LineElement | Buffer, _encoding: string, next: TransformCallback): void;
}
export declare function streamSignalsDone(stream: Stream): Promise<void>;
//# sourceMappingURL=line-splitter.d.ts.map