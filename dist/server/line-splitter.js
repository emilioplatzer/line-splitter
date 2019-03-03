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
        super(Object.assign({ readableObjectMode: true }, options));
        this.internalBuffer = [];
        this.eol13 = Buffer.from('\r\n');
        this.eol10 = Buffer.from('\n');
    }
    _transform(chunk, _encoding, next) {
        var index = 0;
        var pos;
        while ((pos = chunk.indexOf(10, index)) != -1) {
            var with13 = pos && chunk[pos - 1] == 13;
            this.push({ line: Buffer.concat([...this.internalBuffer, chunk.slice(index, pos - (with13 ? 1 : 0))]), eol: with13 ? this.eol13 : this.eol10 });
            this.internalBuffer = [];
            index = pos + 1;
        }
        this.internalBuffer.push(chunk.slice(index));
        next();
    }
    _flush(done) {
        this.push({ line: Buffer.concat(this.internalBuffer), eol: Buffer.from('') });
        done();
    }
}
exports.LineSplitter = LineSplitter;
class LineJoiner extends stream_1.Transform {
    constructor(options) {
        super(Object.assign({ writableObjectMode: true }, options));
    }
    _transform(chunk, _encoding, next) {
        this.push(chunk.line);
        this.push(chunk.eol);
        next();
    }
}
exports.LineJoiner = LineJoiner;
class EscapeCharsTransform extends stream_1.Transform {
    constructor(options) {
        var { charsToEscape, prefixChar } = options, superOptions = __rest(options, ["charsToEscape", "prefixChar"]);
        super(Object.assign({ objectMode: true }, superOptions));
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
        var parts = [];
        while (pos < chunk.line.byteLength) {
            if (this.charsMap[chunk.line[pos]]) {
                parts.push(chunk.line.slice(index, pos));
                parts.push(this.prefixBuffer);
                index = pos;
            }
            pos++;
        }
        parts.push(chunk.line.slice(index));
        this.push({ line: Buffer.concat(parts), eol: chunk.eol });
        next();
    }
}
exports.EscapeCharsTransform = EscapeCharsTransform;
async function streamSignalsClose(stream) {
    return new Promise(function (resolve, reject) {
        stream.on('error', reject);
        stream.on('close', resolve);
    });
}
exports.streamSignalsClose = streamSignalsClose;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluZS1zcGxpdHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2ZXIvbGluZS1zcGxpdHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7O0FBRWIsbUNBQStFO0FBSS9FLE1BQWEsWUFBYSxTQUFRLGtCQUFTO0lBSXZDLFlBQVksT0FBd0I7UUFDaEMsS0FBSyxpQkFBRSxrQkFBa0IsRUFBQyxJQUFJLElBQUssT0FBTyxFQUFFLENBQUM7UUFKekMsbUJBQWMsR0FBVSxFQUFFLENBQUM7UUFDM0IsVUFBSyxHQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUIsVUFBSyxHQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFHaEMsQ0FBQztJQUNELFVBQVUsQ0FBQyxLQUFZLEVBQUUsU0FBZ0IsRUFBRSxJQUFzQjtRQUM3RCxJQUFJLEtBQUssR0FBQyxDQUFDLENBQUM7UUFDWixJQUFJLEdBQVUsQ0FBQztRQUNmLE9BQU0sQ0FBQyxHQUFHLEdBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUMsS0FBSyxDQUFDLENBQUMsSUFBRSxDQUFDLENBQUMsRUFBQztZQUNwQyxJQUFJLE1BQU0sR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDLEdBQUcsR0FBQyxDQUFDLENBQUMsSUFBRSxFQUFFLENBQUM7WUFDckMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFDLElBQUksRUFBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFDLEdBQUcsR0FBQyxDQUFDLE1BQU0sQ0FBQSxDQUFDLENBQUEsQ0FBQyxDQUFBLENBQUMsQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUMsTUFBTSxDQUFBLENBQUMsQ0FBQSxJQUFJ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LElBQUksRUFBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBQyxLQUFLLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQTtRQUNyRCxJQUFJLEVBQUUsQ0FBQztJQUNYLENBQUM7Q0FDSjtBQTlCRCxvREE4QkM7QUFFTSxLQUFLLFVBQVUsa0JBQWtCLENBQUMsTUFBYTtJQUNsRCxPQUFPLElBQUksT0FBTyxDQUFDLFVBQVMsT0FBTyxFQUFFLE1BQU07UUFDdkMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDM0IsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUE7SUFDL0IsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBTEQsZ0RBS0MiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCB7IFRyYW5zZm9ybSwgVHJhbnNmb3JtQ2FsbGJhY2ssIFRyYW5zZm9ybU9wdGlvbnMsIFN0cmVhbSB9IGZyb20gXCJzdHJlYW1cIlxyXG5cclxuZXhwb3J0IHR5cGUgTGluZUVsZW1lbnQgPSB7bGluZTpCdWZmZXIsIGVvbDpCdWZmZXJ9O1xyXG5cclxuZXhwb3J0IGNsYXNzIExpbmVTcGxpdHRlciBleHRlbmRzIFRyYW5zZm9ybSB7XHJcbiAgICBwcml2YXRlIGludGVybmFsQnVmZmVyOkJ1ZmZlcltdPVtdO1xyXG4gICAgcHJpdmF0ZSBlb2wxMz1CdWZmZXIuZnJvbSgnXFxyXFxuJyk7XHJcbiAgICBwcml2YXRlIGVvbDEwPUJ1ZmZlci5mcm9tKCdcXG4nKTtcclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnM6VHJhbnNmb3JtT3B0aW9ucykge1xyXG4gICAgICAgIHN1cGVyKHtyZWFkYWJsZU9iamVjdE1vZGU6dHJ1ZSwgLi4ub3B0aW9uc30pO1xyXG4gICAgfVxyXG4gICAgX3RyYW5zZm9ybShjaHVuazpCdWZmZXIsIF9lbmNvZGluZzpzdHJpbmcsIG5leHQ6VHJhbnNmb3JtQ2FsbGJhY2spe1xyXG4gICAgICAgIHZhciBpbmRleD0wO1xyXG4gICAgICAgIHZhciBwb3M6bnVtYmVyO1xyXG4gICAgICAgIHdoaWxlKChwb3M9Y2h1bmsuaW5kZXhPZigxMCxpbmRleCkpIT0tMSl7XHJcbiAgICAgICAgICAgIHZhciB3aXRoMTMgPSBwb3MgJiYgY2h1bmtbcG9zLTFdPT0xMztcclxuICAgICAgICAgICAgdGhpcy5wdXNoKHtsaW5lOkJ1ZmZlci5jb25jYXQoWy4uLnRoaXMuaW50ZXJuYWxCdWZmZXIsIGNodW5rLnNsaWNlKGluZGV4LHBvcy0od2l0aDEzPzE6MCkpXSksIGVvbDp3aXRoMTM/dGhpcy5lb2wxMzp0aGlzLmVvbDEwfSlcclxuICAgICAgICAgICAgdGhpcy5pbnRlcm5hbEJ1ZmZlcj1bXTtcclxuICAgICAgICAgICAgaW5kZXg9cG9zKzE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaW50ZXJuYWxCdWZmZXIucHVzaChjaHVuay5zbGljZShpbmRleCkpO1xyXG4gICAgICAgIG5leHQoKTtcclxuICAgIH1cclxuICAgIF9mbHVzaChkb25lOlRyYW5zZm9ybUNhbGxiYWNrKXtcclxuICAgICAgICB0aGlzLnB1c2goe2xpbmU6QnVmZmVyLmNvbmNhdCh0aGlzLmludGVybmFsQnVmZmVyKSwgZW9sOkJ1ZmZlci5mcm9tKCcnKX0pO1xyXG4gICAgICAgIGRvbmUoKTtcclxuICAgIH1cclxufSAgICAgICAgICBcclxuXHJcbmV4cG9ydCBjbGFzcyBMaW5lSm9pbmVyIGV4dGVuZHMgVHJhbnNmb3JtIHtcclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnM6VHJhbnNmb3JtT3B0aW9ucykge1xyXG4gICAgICAgIHN1cGVyKHt3cml0YWJsZU9iamVjdE1vZGU6dHJ1ZSwgLi4ub3B0aW9uc30pO1xyXG4gICAgfVxyXG4gICAgX3RyYW5zZm9ybShjaHVuazpMaW5lRWxlbWVudCwgX2VuY29kaW5nOnN0cmluZywgbmV4dDpUcmFuc2Zvcm1DYWxsYmFjayl7XHJcbiAgICAgICAgdGhpcy5wdXNoKGNodW5rLmxpbmUpO1xyXG4gICAgICAgIHRoaXMucHVzaChjaHVuay5lb2wpO1xyXG4gICAgICAgIG5leHQoKTtcclxuICAgIH1cclxufSAgICAgICAgICBcclxuXHJcbmV4cG9ydCB0eXBlIEVzY2FwZUNoYXJzVHJhbnNmb3JtT3B0aW9ucz17Y2hhcnNUb0VzY2FwZTpzdHJpbmcsIHByZWZpeENoYXI6c3RyaW5nfSAmIFRyYW5zZm9ybU9wdGlvbnM7XHJcblxyXG5leHBvcnQgY2xhc3MgRXNjYXBlQ2hhcnNUcmFuc2Zvcm0gZXh0ZW5kcyBUcmFuc2Zvcm0ge1xyXG4gICAgcHJpdmF0ZSBjaGFyc01hcDp7W2tleTpzdHJpbmddOiB0cnVlfTtcclxuICAgIHByaXZhdGUgcHJlZml4QnVmZmVyOkJ1ZmZlcjtcclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnM6RXNjYXBlQ2hhcnNUcmFuc2Zvcm1PcHRpb25zKSB7XHJcbiAgICAgICAgdmFyIHtjaGFyc1RvRXNjYXBlLCBwcmVmaXhDaGFyLCAuLi5zdXBlck9wdGlvbnN9ID0gb3B0aW9ucztcclxuICAgICAgICBzdXBlcih7b2JqZWN0TW9kZTp0cnVlLCAuLi5zdXBlck9wdGlvbnN9KTtcclxuICAgICAgICB0aGlzLnByZWZpeEJ1ZmZlcj1CdWZmZXIuYWxsb2MoMSxwcmVmaXhDaGFyKTtcclxuICAgICAgICB0aGlzLmNoYXJzTWFwPXt9O1xyXG4gICAgICAgIHZhciBzZWxmPXRoaXM7XHJcbiAgICAgICAgY2hhcnNUb0VzY2FwZS5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbihjaGFyKXtcclxuICAgICAgICAgICAgdmFyIGFzY2lpOm51bWJlcj1jaGFyLmNoYXJDb2RlQXQoMCk7XHJcbiAgICAgICAgICAgIHNlbGYuY2hhcnNNYXBbYXNjaWldPXRydWU7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuICAgIF90cmFuc2Zvcm0oY2h1bms6TGluZUVsZW1lbnQsIF9lbmNvZGluZzpzdHJpbmcsIG5leHQ6VHJhbnNmb3JtQ2FsbGJhY2spe1xyXG4gICAgICAgIHZhciBpbmRleD0wO1xyXG4gICAgICAgIHZhciBwb3M9MDtcclxuICAgICAgICB2YXIgcGFydHM6QnVmZmVyW109W107XHJcbiAgICAgICAgd2hpbGUocG9zPGNodW5rLmxpbmUuYnl0ZUxlbmd0aCl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuY2hhcnNNYXBbY2h1bmsubGluZVtwb3NdXSl7XHJcbiAgICAgICAgICAgICAgICBwYXJ0cy5wdXNoKGNodW5rLmxpbmUuc2xpY2UoaW5kZXgscG9zKSk7XHJcbiAgICAgICAgICAgICAgICBwYXJ0cy5wdXNoKHRoaXMucHJlZml4QnVmZmVyKTtcclxuICAgICAgICAgICAgICAgIGluZGV4PXBvcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwb3MrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgcGFydHMucHVzaChjaHVuay5saW5lLnNsaWNlKGluZGV4KSk7XHJcbiAgICAgICAgdGhpcy5wdXNoKHtsaW5lOkJ1ZmZlci5jb25jYXQocGFydHMpLCBlb2w6Y2h1bmsuZW9sfSlcclxuICAgICAgICBuZXh0KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzdHJlYW1TaWduYWxzQ2xvc2Uoc3RyZWFtOlN0cmVhbSk6UHJvbWlzZTx2b2lkPntcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xyXG4gICAgICAgIHN0cmVhbS5vbignZXJyb3InLCByZWplY3QpO1xyXG4gICAgICAgIHN0cmVhbS5vbignY2xvc2UnLCByZXNvbHZlKVxyXG4gICAgfSk7XHJcbn1cclxuIl19