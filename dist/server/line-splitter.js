"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamSignalsDone = exports.EscapeCharsTransform = exports.LineJoiner = exports.LineSplitter = void 0;
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
        if (this.internalBuffer.length && this.internalBuffer.find(x => x.length > 0 || x.byteLength > 0)) {
            this.push({ line: Buffer.concat(this.internalBuffer), eol: Buffer.from('') });
        }
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
    constructor(options, mode) {
        var { charsToEscape, prefixChar } = options, superOptions = __rest(options, ["charsToEscape", "prefixChar"]);
        super(Object.assign({ objectMode: mode === 'lines' }, superOptions));
        this.prefixBuffer = Buffer.alloc(1, prefixChar);
        this.charsMap = {};
        this.mode = mode;
        var self = this;
        charsToEscape.split('').forEach(function (char) {
            var ascii = char.charCodeAt(0);
            self.charsMap[ascii] = true;
        });
    }
    _transform(chunk, _encoding, next) {
        var index = 0;
        var pos = 0;
        var line;
        var parts;
        if (this.mode === 'lines') {
            parts = [];
            line = chunk.line;
        }
        else {
            parts = this;
            line = chunk;
        }
        while (pos < line.byteLength) {
            if (this.charsMap[line[pos]]) {
                parts.push(line.slice(index, pos));
                parts.push(this.prefixBuffer);
                index = pos;
            }
            pos++;
        }
        parts.push(line.slice(index));
        if (this.mode === 'lines') {
            this.push({ line: Buffer.concat(parts), eol: chunk.eol });
        }
        next();
    }
}
exports.EscapeCharsTransform = EscapeCharsTransform;
async function streamSignalsDone(stream) {
    return new Promise(function (resolve, reject) {
        stream.on('error', reject);
        stream.on('close', resolve);
        stream.on('end', resolve);
        stream.on('finish', resolve);
    });
}
exports.streamSignalsDone = streamSignalsDone;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluZS1zcGxpdHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2ZXIvbGluZS1zcGxpdHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FBRWIsbUNBQStFO0FBSS9FLE1BQWEsWUFBYSxTQUFRLGtCQUFTO0lBSXZDLFlBQVksT0FBd0I7UUFDaEMsS0FBSyxpQkFBRSxrQkFBa0IsRUFBQyxJQUFJLElBQUssT0FBTyxFQUFFLENBQUM7UUFKekMsbUJBQWMsR0FBVSxFQUFFLENBQUM7UUFDM0IsVUFBSyxHQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUIsVUFBSyxHQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFHaEMsQ0FBQztJQUNELFVBQVUsQ0FBQyxLQUFZLEVBQUUsU0FBZ0IsRUFBRSxJQUFzQjtRQUM3RCxJQUFJLEtBQUssR0FBQyxDQUFDLENBQUM7UUFDWixJQUFJLEdBQVUsQ0FBQztRQUNmLE9BQU0sQ0FBQyxHQUFHLEdBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUMsS0FBSyxDQUFDLENBQUMsSUFBRSxDQUFDLENBQUMsRUFBQztZQUNwQyxJQUFJLE1BQU0sR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDLEdBQUcsR0FBQyxDQUFDLENBQUMsSUFBRSxFQUFFLENBQUM7WUFDckMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFDLElBQUksRUFBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFDLEdBQUcsR0FBQyxDQUFDLE1BQU0sQ0FBQSxDQUFDLENBQUEsQ0FBQyxDQUFBLENBQUMsQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUMsTUFBTSxDQUFBLENBQUMsQ0FBQSxJ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cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgeyBUcmFuc2Zvcm0sIFRyYW5zZm9ybUNhbGxiYWNrLCBUcmFuc2Zvcm1PcHRpb25zLCBTdHJlYW0gfSBmcm9tIFwic3RyZWFtXCJcclxuXHJcbmV4cG9ydCB0eXBlIExpbmVFbGVtZW50ID0ge2xpbmU6QnVmZmVyLCBlb2w6QnVmZmVyfTtcclxuXHJcbmV4cG9ydCBjbGFzcyBMaW5lU3BsaXR0ZXIgZXh0ZW5kcyBUcmFuc2Zvcm0ge1xyXG4gICAgcHJpdmF0ZSBpbnRlcm5hbEJ1ZmZlcjpCdWZmZXJbXT1bXTtcclxuICAgIHByaXZhdGUgZW9sMTM9QnVmZmVyLmZyb20oJ1xcclxcbicpO1xyXG4gICAgcHJpdmF0ZSBlb2wxMD1CdWZmZXIuZnJvbSgnXFxuJyk7XHJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zOlRyYW5zZm9ybU9wdGlvbnMpIHtcclxuICAgICAgICBzdXBlcih7cmVhZGFibGVPYmplY3RNb2RlOnRydWUsIC4uLm9wdGlvbnN9KTtcclxuICAgIH1cclxuICAgIF90cmFuc2Zvcm0oY2h1bms6QnVmZmVyLCBfZW5jb2Rpbmc6c3RyaW5nLCBuZXh0OlRyYW5zZm9ybUNhbGxiYWNrKXtcclxuICAgICAgICB2YXIgaW5kZXg9MDtcclxuICAgICAgICB2YXIgcG9zOm51bWJlcjtcclxuICAgICAgICB3aGlsZSgocG9zPWNodW5rLmluZGV4T2YoMTAsaW5kZXgpKSE9LTEpe1xyXG4gICAgICAgICAgICB2YXIgd2l0aDEzID0gcG9zICYmIGNodW5rW3Bvcy0xXT09MTM7XHJcbiAgICAgICAgICAgIHRoaXMucHVzaCh7bGluZTpCdWZmZXIuY29uY2F0KFsuLi50aGlzLmludGVybmFsQnVmZmVyLCBjaHVuay5zbGljZShpbmRleCxwb3MtKHdpdGgxMz8xOjApKV0pLCBlb2w6d2l0aDEzP3RoaXMuZW9sMTM6dGhpcy5lb2wxMH0pXHJcbiAgICAgICAgICAgIHRoaXMuaW50ZXJuYWxCdWZmZXI9W107XHJcbiAgICAgICAgICAgIGluZGV4PXBvcysxO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmludGVybmFsQnVmZmVyLnB1c2goY2h1bmsuc2xpY2UoaW5kZXgpKTtcclxuICAgICAgICBuZXh0KCk7XHJcbiAgICB9XHJcbiAgICBfZmx1c2goZG9uZTpUcmFuc2Zvcm1DYWxsYmFjayl7XHJcbiAgICAgICAgaWYodGhpcy5pbnRlcm5hbEJ1ZmZlci5sZW5ndGggJiYgdGhpcy5pbnRlcm5hbEJ1ZmZlci5maW5kKHg9PngubGVuZ3RoPjAgfHwgeC5ieXRlTGVuZ3RoPjApKXtcclxuICAgICAgICAgICAgdGhpcy5wdXNoKHtsaW5lOkJ1ZmZlci5jb25jYXQodGhpcy5pbnRlcm5hbEJ1ZmZlciksIGVvbDpCdWZmZXIuZnJvbSgnJyl9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZG9uZSgpO1xyXG4gICAgfVxyXG59ICAgICAgICAgIFxyXG5cclxuZXhwb3J0IGNsYXNzIExpbmVKb2luZXIgZXh0ZW5kcyBUcmFuc2Zvcm0ge1xyXG4gICAgY29uc3RydWN0b3Iob3B0aW9uczpUcmFuc2Zvcm1PcHRpb25zKSB7XHJcbiAgICAgICAgc3VwZXIoe3dyaXRhYmxlT2JqZWN0TW9kZTp0cnVlLCAuLi5vcHRpb25zfSk7XHJcbiAgICB9XHJcbiAgICBfdHJhbnNmb3JtKGNodW5rOkxpbmVFbGVtZW50LCBfZW5jb2Rpbmc6c3RyaW5nLCBuZXh0OlRyYW5zZm9ybUNhbGxiYWNrKXtcclxuICAgICAgICB0aGlzLnB1c2goY2h1bmsubGluZSk7XHJcbiAgICAgICAgdGhpcy5wdXNoKGNodW5rLmVvbCk7XHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgfVxyXG59ICAgICAgICAgIFxyXG5cclxuZXhwb3J0IHR5cGUgRXNjYXBlQ2hhcnNUcmFuc2Zvcm1Nb2RlPSdsaW5lcyc7XHJcbmV4cG9ydCB0eXBlIEVzY2FwZUNoYXJzVHJhbnNmb3JtT3B0aW9ucz17Y2hhcnNUb0VzY2FwZTpzdHJpbmcsIHByZWZpeENoYXI6c3RyaW5nfSAmIFRyYW5zZm9ybU9wdGlvbnM7XHJcblxyXG5leHBvcnQgY2xhc3MgRXNjYXBlQ2hhcnNUcmFuc2Zvcm0gZXh0ZW5kcyBUcmFuc2Zvcm0ge1xyXG4gICAgcHJpdmF0ZSBjaGFyc01hcDp7W2tleTpzdHJpbmddOiB0cnVlfTtcclxuICAgIHByaXZhdGUgcHJlZml4QnVmZmVyOkJ1ZmZlcjtcclxuICAgIHByaXZhdGUgbW9kZTpFc2NhcGVDaGFyc1RyYW5zZm9ybU1vZGV8dW5kZWZpbmVkO1xyXG4gICAgY29uc3RydWN0b3Iob3B0aW9uczpFc2NhcGVDaGFyc1RyYW5zZm9ybU9wdGlvbnMsIG1vZGU/OkVzY2FwZUNoYXJzVHJhbnNmb3JtTW9kZSkge1xyXG4gICAgICAgIHZhciB7Y2hhcnNUb0VzY2FwZSwgcHJlZml4Q2hhciwgLi4uc3VwZXJPcHRpb25zfSA9IG9wdGlvbnM7XHJcbiAgICAgICAgc3VwZXIoe29iamVjdE1vZGU6bW9kZT09PSdsaW5lcycsIC4uLnN1cGVyT3B0aW9uc30pO1xyXG4gICAgICAgIHRoaXMucHJlZml4QnVmZmVyPUJ1ZmZlci5hbGxvYygxLHByZWZpeENoYXIpO1xyXG4gICAgICAgIHRoaXMuY2hhcnNNYXA9e307XHJcbiAgICAgICAgdGhpcy5tb2RlPW1vZGU7XHJcbiAgICAgICAgdmFyIHNlbGY9dGhpcztcclxuICAgICAgICBjaGFyc1RvRXNjYXBlLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uKGNoYXIpe1xyXG4gICAgICAgICAgICB2YXIgYXNjaWk6bnVtYmVyPWNoYXIuY2hhckNvZGVBdCgwKTtcclxuICAgICAgICAgICAgc2VsZi5jaGFyc01hcFthc2NpaV09dHJ1ZTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgX3RyYW5zZm9ybShjaHVuazpMaW5lRWxlbWVudHxCdWZmZXIsIF9lbmNvZGluZzpzdHJpbmcsIG5leHQ6VHJhbnNmb3JtQ2FsbGJhY2spe1xyXG4gICAgICAgIHZhciBpbmRleD0wO1xyXG4gICAgICAgIHZhciBwb3M9MDtcclxuICAgICAgICB2YXIgbGluZTpCdWZmZXI7XHJcbiAgICAgICAgdmFyIHBhcnRzOntwdXNoOihwYXJ0OkJ1ZmZlcik9PnZvaWR9O1xyXG4gICAgICAgIGlmKHRoaXMubW9kZSA9PT0gJ2xpbmVzJyl7XHJcbiAgICAgICAgICAgIHBhcnRzPVtdIGFzIEJ1ZmZlcltdO1xyXG4gICAgICAgICAgICBsaW5lPShjaHVuayBhcyBMaW5lRWxlbWVudCkubGluZTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgcGFydHM9dGhpcztcclxuICAgICAgICAgICAgbGluZT1jaHVuayBhcyBCdWZmZXI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdoaWxlKHBvczxsaW5lLmJ5dGVMZW5ndGgpe1xyXG4gICAgICAgICAgICBpZih0aGlzLmNoYXJzTWFwW2xpbmVbcG9zXV0pe1xyXG4gICAgICAgICAgICAgICAgcGFydHMucHVzaChsaW5lLnNsaWNlKGluZGV4LHBvcykpO1xyXG4gICAgICAgICAgICAgICAgcGFydHMucHVzaCh0aGlzLnByZWZpeEJ1ZmZlcik7XHJcbiAgICAgICAgICAgICAgICBpbmRleD1wb3M7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcG9zKys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBhcnRzLnB1c2gobGluZS5zbGljZShpbmRleCkpO1xyXG4gICAgICAgIGlmKHRoaXMubW9kZSA9PT0gJ2xpbmVzJyl7XHJcbiAgICAgICAgICAgIHRoaXMucHVzaCh7bGluZTpCdWZmZXIuY29uY2F0KHBhcnRzIGFzIEJ1ZmZlcltdKSwgZW9sOihjaHVuayBhcyBMaW5lRWxlbWVudCkuZW9sfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc3RyZWFtU2lnbmFsc0RvbmUoc3RyZWFtOlN0cmVhbSk6UHJvbWlzZTx2b2lkPntcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xyXG4gICAgICAgIHN0cmVhbS5vbignZXJyb3InLCByZWplY3QgKTtcclxuICAgICAgICBzdHJlYW0ub24oJ2Nsb3NlJywgcmVzb2x2ZSk7XHJcbiAgICAgICAgc3RyZWFtLm9uKCdlbmQnLCAgIHJlc29sdmUpO1xyXG4gICAgICAgIHN0cmVhbS5vbignZmluaXNoJyxyZXNvbHZlKTtcclxuICAgIH0pO1xyXG59XHJcbiJdfQ==