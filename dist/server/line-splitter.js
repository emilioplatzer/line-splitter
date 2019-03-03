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
async function forEndOf(stream) {
    return new Promise(function (resolve, reject) {
        stream.on('error', reject);
        stream.on('close', resolve);
    });
}
exports.forEndOf = forEndOf;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluZS1zcGxpdHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2ZXIvbGluZS1zcGxpdHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7O0FBRWIsbUNBQStFO0FBRS9FLE1BQWEsWUFBYSxTQUFRLGtCQUFTO0lBSXZDLFlBQVksT0FBd0I7UUFDaEMsS0FBSyxpQkFBRSxrQkFBa0IsRUFBQyxJQUFJLElBQUssT0FBTyxFQUFFLENBQUM7UUFKekMsbUJBQWMsR0FBVSxFQUFFLENBQUM7UUFDM0IsVUFBSyxHQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUIsVUFBSyxHQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFHaEMsQ0FBQztJQUNELFVBQVUsQ0FBQyxLQUFZLEVBQUUsU0FBZ0IsRUFBRSxJQUFzQjtRQUM3RCxJQUFJLEtBQUssR0FBQyxDQUFDLENBQUM7UUFDWixJQUFJLEdBQVUsQ0FBQztRQUNmLE9BQU0sQ0FBQyxHQUFHLEdBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUMsS0FBSyxDQUFDLENBQUMsSUFBRSxDQUFDLENBQUMsRUFBQztZQUNwQyxJQUFJLE1BQU0sR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDLEdBQUcsR0FBQyxDQUFDLENBQUMsSUFBRSxFQUFFLENBQUM7WUFDckMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFDLElBQUksRUFBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFDLEdBQUcsR0FBQyxDQUFDLE1BQU0sQ0FBQSxDQUFDLENBQUEsQ0FBQyxDQUFBLENBQUMsQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUMsTUFBTSxDQUFBLENBQUMsQ0FBQSxJQUFJ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LElBQUksRUFBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBQyxLQUFLLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQTtRQUNyRCxJQUFJLEVBQUUsQ0FBQztJQUNYLENBQUM7Q0FDSjtBQTlCRCxvREE4QkM7QUFFTSxLQUFLLFVBQVUsUUFBUSxDQUFDLE1BQWE7SUFDeEMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFTLE9BQU8sRUFBRSxNQUFNO1FBQ3ZDLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzNCLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFBO0lBQy9CLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQUxELDRCQUtDIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgeyBUcmFuc2Zvcm0sIFRyYW5zZm9ybUNhbGxiYWNrLCBUcmFuc2Zvcm1PcHRpb25zLCBTdHJlYW0gfSBmcm9tIFwic3RyZWFtXCJcclxuXHJcbmV4cG9ydCBjbGFzcyBMaW5lU3BsaXR0ZXIgZXh0ZW5kcyBUcmFuc2Zvcm0ge1xyXG4gICAgcHJpdmF0ZSBpbnRlcm5hbEJ1ZmZlcjpCdWZmZXJbXT1bXTtcclxuICAgIHByaXZhdGUgZW9sMTM9QnVmZmVyLmZyb20oJ1xcclxcbicpO1xyXG4gICAgcHJpdmF0ZSBlb2wxMD1CdWZmZXIuZnJvbSgnXFxuJyk7XHJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zOlRyYW5zZm9ybU9wdGlvbnMpIHtcclxuICAgICAgICBzdXBlcih7cmVhZGFibGVPYmplY3RNb2RlOnRydWUsIC4uLm9wdGlvbnN9KTtcclxuICAgIH1cclxuICAgIF90cmFuc2Zvcm0oY2h1bms6QnVmZmVyLCBfZW5jb2Rpbmc6c3RyaW5nLCBuZXh0OlRyYW5zZm9ybUNhbGxiYWNrKXtcclxuICAgICAgICB2YXIgaW5kZXg9MDtcclxuICAgICAgICB2YXIgcG9zOm51bWJlcjtcclxuICAgICAgICB3aGlsZSgocG9zPWNodW5rLmluZGV4T2YoMTAsaW5kZXgpKSE9LTEpe1xyXG4gICAgICAgICAgICB2YXIgd2l0aDEzID0gcG9zICYmIGNodW5rW3Bvcy0xXT09MTM7XHJcbiAgICAgICAgICAgIHRoaXMucHVzaCh7bGluZTpCdWZmZXIuY29uY2F0KFsuLi50aGlzLmludGVybmFsQnVmZmVyLCBjaHVuay5zbGljZShpbmRleCxwb3MtKHdpdGgxMz8xOjApKV0pLCBlb2w6d2l0aDEzP3RoaXMuZW9sMTM6dGhpcy5lb2wxMH0pXHJcbiAgICAgICAgICAgIHRoaXMuaW50ZXJuYWxCdWZmZXI9W107XHJcbiAgICAgICAgICAgIGluZGV4PXBvcysxO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmludGVybmFsQnVmZmVyLnB1c2goY2h1bmsuc2xpY2UoaW5kZXgpKTtcclxuICAgICAgICBuZXh0KCk7XHJcbiAgICB9XHJcbiAgICBfZmx1c2goZG9uZTpUcmFuc2Zvcm1DYWxsYmFjayl7XHJcbiAgICAgICAgdGhpcy5wdXNoKHtsaW5lOkJ1ZmZlci5jb25jYXQodGhpcy5pbnRlcm5hbEJ1ZmZlciksIGVvbDpCdWZmZXIuZnJvbSgnJyl9KTtcclxuICAgICAgICBkb25lKCk7XHJcbiAgICB9XHJcbn0gICAgICAgICAgXHJcblxyXG5leHBvcnQgY2xhc3MgTGluZUpvaW5lciBleHRlbmRzIFRyYW5zZm9ybSB7XHJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zOlRyYW5zZm9ybU9wdGlvbnMpIHtcclxuICAgICAgICBzdXBlcih7d3JpdGFibGVPYmplY3RNb2RlOnRydWUsIC4uLm9wdGlvbnN9KTtcclxuICAgIH1cclxuICAgIF90cmFuc2Zvcm0oY2h1bms6e2xpbmU6QnVmZmVyLCBlb2w6QnVmZmVyfSwgX2VuY29kaW5nOnN0cmluZywgbmV4dDpUcmFuc2Zvcm1DYWxsYmFjayl7XHJcbiAgICAgICAgdGhpcy5wdXNoKGNodW5rLmxpbmUpO1xyXG4gICAgICAgIHRoaXMucHVzaChjaHVuay5lb2wpO1xyXG4gICAgICAgIG5leHQoKTtcclxuICAgIH1cclxufSAgICAgICAgICBcclxuXHJcbmV4cG9ydCB0eXBlIEVzY2FwZUNoYXJzVHJhbnNmb3JtT3B0aW9ucz17Y2hhcnNUb0VzY2FwZTpzdHJpbmcsIHByZWZpeENoYXI6c3RyaW5nfSAmIFRyYW5zZm9ybU9wdGlvbnM7XHJcblxyXG5leHBvcnQgY2xhc3MgRXNjYXBlQ2hhcnNUcmFuc2Zvcm0gZXh0ZW5kcyBUcmFuc2Zvcm0ge1xyXG4gICAgcHJpdmF0ZSBjaGFyc01hcDp7W2tleTpzdHJpbmddOiB0cnVlfTtcclxuICAgIHByaXZhdGUgcHJlZml4QnVmZmVyOkJ1ZmZlcjtcclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnM6RXNjYXBlQ2hhcnNUcmFuc2Zvcm1PcHRpb25zKSB7XHJcbiAgICAgICAgdmFyIHtjaGFyc1RvRXNjYXBlLCBwcmVmaXhDaGFyLCAuLi5zdXBlck9wdGlvbnN9ID0gb3B0aW9ucztcclxuICAgICAgICBzdXBlcih7b2JqZWN0TW9kZTp0cnVlLCAuLi5zdXBlck9wdGlvbnN9KTtcclxuICAgICAgICB0aGlzLnByZWZpeEJ1ZmZlcj1CdWZmZXIuYWxsb2MoMSxwcmVmaXhDaGFyKTtcclxuICAgICAgICB0aGlzLmNoYXJzTWFwPXt9O1xyXG4gICAgICAgIHZhciBzZWxmPXRoaXM7XHJcbiAgICAgICAgY2hhcnNUb0VzY2FwZS5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbihjaGFyKXtcclxuICAgICAgICAgICAgdmFyIGFzY2lpOm51bWJlcj1jaGFyLmNoYXJDb2RlQXQoMCk7XHJcbiAgICAgICAgICAgIHNlbGYuY2hhcnNNYXBbYXNjaWldPXRydWU7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuICAgIF90cmFuc2Zvcm0oY2h1bms6e2xpbmU6QnVmZmVyLCBlb2w6QnVmZmVyfSwgX2VuY29kaW5nOnN0cmluZywgbmV4dDpUcmFuc2Zvcm1DYWxsYmFjayl7XHJcbiAgICAgICAgdmFyIGluZGV4PTA7XHJcbiAgICAgICAgdmFyIHBvcz0wO1xyXG4gICAgICAgIHZhciBwYXJ0czpCdWZmZXJbXT1bXTtcclxuICAgICAgICB3aGlsZShwb3M8Y2h1bmsubGluZS5ieXRlTGVuZ3RoKXtcclxuICAgICAgICAgICAgaWYodGhpcy5jaGFyc01hcFtjaHVuay5saW5lW3Bvc11dKXtcclxuICAgICAgICAgICAgICAgIHBhcnRzLnB1c2goY2h1bmsubGluZS5zbGljZShpbmRleCxwb3MpKTtcclxuICAgICAgICAgICAgICAgIHBhcnRzLnB1c2godGhpcy5wcmVmaXhCdWZmZXIpO1xyXG4gICAgICAgICAgICAgICAgaW5kZXg9cG9zO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHBvcysrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwYXJ0cy5wdXNoKGNodW5rLmxpbmUuc2xpY2UoaW5kZXgpKTtcclxuICAgICAgICB0aGlzLnB1c2goe2xpbmU6QnVmZmVyLmNvbmNhdChwYXJ0cyksIGVvbDpjaHVuay5lb2x9KVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZvckVuZE9mKHN0cmVhbTpTdHJlYW0pOlByb21pc2U8dm9pZD57XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcclxuICAgICAgICBzdHJlYW0ub24oJ2Vycm9yJywgcmVqZWN0KTtcclxuICAgICAgICBzdHJlYW0ub24oJ2Nsb3NlJywgcmVzb2x2ZSlcclxuICAgIH0pO1xyXG59XHJcbiJdfQ==