"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
class LineSplitter extends stream_1.Transform {
    constructor(options) {
        super(options);
        this.internalBuffer = null;
    }
    _transform(chunk, _encoding, next) {
        var index = 0;
        var pos;
        var buf2Send;
        while ((pos = chunk.indexOf(10, index)) != -1) {
            if (this.internalBuffer) {
                chunk.copy(this.internalBuffer, this.internalBuffer.byteLength, index, pos + 1);
                buf2Send = this.internalBuffer;
                this.internalBuffer = null;
            }
            else {
                buf2Send = chunk.slice(index, pos + 1);
            }
            this.push(buf2Send);
            index = pos + 1;
        }
        this.internalBuffer = chunk.slice(index);
        next();
    }
    _flush(done) {
        this.push(this.internalBuffer);
        done();
    }
}
exports.LineSplitter = LineSplitter;
class EscapeCharsTransform extends stream_1.Transform {
    constructor(options) {
        var { charsToEscape, prefixChar } = options, superOptions = __rest(options, ["charsToEscape", "prefixChar"]);
        super(superOptions);
        this.prefixBuffer = Buffer.alloc(1, prefixChar);
        this.charsMap = {};
        var self = this;
        charsToEscape.split('').forEach(function (char) {
            var ascii = char.charCodeAt(0);
            self.charsMap[ascii] = true;
        });
    }
    _transform(chunk, _encoding, next) {
        var index = 0;
        var pos = 0;
        while (pos < chunk.byteLength) {
            if (this.charsMap[chunk[pos]]) {
                this.push(chunk.slice(index, pos));
                this.push(this.prefixBuffer);
                index = pos;
            }
            pos++;
        }
        this.push(chunk.slice(index));
        next();
    }
}
exports.EscapeCharsTransform = EscapeCharsTransform;
async function forEndOf(stream) {
    return new Promise(function (resolve, reject) {
        stream.on('error', reject);
        stream.on('close', resolve);
    });
}
exports.forEndOf = forEndOf;
//# sourceMappingURL=line-splitter.js.map