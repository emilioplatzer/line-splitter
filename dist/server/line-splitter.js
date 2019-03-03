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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluZS1zcGxpdHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2ZXIvbGluZS1zcGxpdHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7O0FBRWIsbUNBQStFO0FBRS9FLE1BQWEsWUFBYSxTQUFRLGtCQUFTO0lBRXZDLFlBQVksT0FBd0I7UUFDaEMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRlgsbUJBQWMsR0FBYSxJQUFJLENBQUM7SUFHeEMsQ0FBQztJQUNELFVBQVUsQ0FBQyxLQUFZLEVBQUUsU0FBZ0IsRUFBRSxJQUFzQjtRQUM3RCxJQUFJLEtBQUssR0FBQyxDQUFDLENBQUM7UUFDWixJQUFJLEdBQVUsQ0FBQztRQUNmLElBQUksUUFBZSxDQUFDO1FBQ3BCLE9BQU0sQ0FBQyxHQUFHLEdBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUMsS0FBSyxDQUFDLENBQUMsSUFBRSxDQUFDLENBQUMsRUFBQztZQUNwQyxJQUFHLElBQUksQ0FBQyxjQUFjLEVBQUM7Z0JBQ25CLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsR0FBRyxHQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzRSxRQUFRLEdBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQztnQkFDN0IsSUFBSSxDQUFDLGNBQWMsR0FBQyxJQUFJLENBQUM7YUFDNUI7aUJBQUk7Z0JBQ0QsUUFBUSxHQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFDLEdBQUcsR0FBQyxDQUFDLENBQUMsQ0FBQzthQUNyQztZQUNELElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDcEIsS0FBSyxHQUFDLEdBQUcsR0FBQyxDQUFDLENBQUM7U0FDZjtRQUNELElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN6QyxJQUFJLEVBQUUsQ0FBQztJQUNYLENBQUM7SUFDRCxNQUFNLENBQUMsSUFBc0I7UUFDekIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDL0IsSUFBSSxFQUFFLENBQUM7SUFDWCxDQUFDO0NBQ0o7QUEzQkQsb0NBMkJDO0FBSUQsTUFBYSxvQkFBcUIsU0FBUSxrQkFBUztJQUcvQyxZQUFZLE9BQW1DO1FBQzNDLElBQUksRUFBQyxhQUFhLEVBQUUsVUFBVSxLQUFxQixPQUFPLEVBQTFCLCtEQUEwQixDQUFDO1FBQzNELEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNwQixJQUFJLENBQUMsWUFBWSxHQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxRQUFRLEdBQUMsRUFBRSxDQUFDO1FBQ2pCLElBQUksSUFBSSxHQUFDLElBQUksQ0FBQztRQUNkLGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVMsSUFBSTtZQUN6QyxJQUFJLEtBQUssR0FBUSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUMsSUFBSSxDQUFDO1FBQzlCLENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQztJQUNELFVBQVUsQ0FBQyxLQUFZLEVBQUUsU0FBZ0IsRUFBRSxJQUFzQjtRQUM3RCxJQUFJLEtBQUssR0FBQyxDQUFDLENBQUM7UUFDWixJQUFJLEdBQUcsR0FBQyxDQUFDLENBQUM7UUFDVixPQUFNLEdBQUcsR0FBQyxLQUFLLENBQUMsVUFBVSxFQUFDO1lBQ3ZCLElBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQztnQkFDekIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNuQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDN0IsS0FBSyxHQUFDLEdBQUcsQ0FBQzthQUNiO1lBQ0QsR0FBRyxFQUFFLENBQUM7U0FDVDtRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQzlCLElBQUksRUFBRSxDQUFDO0lBQ1gsQ0FBQztDQUNKO0FBNUJELG9EQTRCQztBQUVNLEtBQUssVUFBVSxRQUFRLENBQUMsTUFBYTtJQUN4QyxPQUFPLElBQUksT0FBTyxDQUFDLFVBQVMsT0FBTyxFQUFFLE1BQU07UUFDdkMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDM0IsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUE7SUFDL0IsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBTEQsNEJBS0MiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCB7IFRyYW5zZm9ybSwgVHJhbnNmb3JtQ2FsbGJhY2ssIFRyYW5zZm9ybU9wdGlvbnMsIFN0cmVhbSB9IGZyb20gXCJzdHJlYW1cIlxyXG5cclxuZXhwb3J0IGNsYXNzIExpbmVTcGxpdHRlciBleHRlbmRzIFRyYW5zZm9ybSB7XHJcbiAgICBwcml2YXRlIGludGVybmFsQnVmZmVyOkJ1ZmZlcnxudWxsPW51bGw7XHJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zOlRyYW5zZm9ybU9wdGlvbnMpIHtcclxuICAgICAgICBzdXBlcihvcHRpb25zKTtcclxuICAgIH1cclxuICAgIF90cmFuc2Zvcm0oY2h1bms6QnVmZmVyLCBfZW5jb2Rpbmc6c3RyaW5nLCBuZXh0OlRyYW5zZm9ybUNhbGxiYWNrKXtcclxuICAgICAgICB2YXIgaW5kZXg9MDtcclxuICAgICAgICB2YXIgcG9zOm51bWJlcjtcclxuICAgICAgICB2YXIgYnVmMlNlbmQ6QnVmZmVyO1xyXG4gICAgICAgIHdoaWxlKChwb3M9Y2h1bmsuaW5kZXhPZigxMCxpbmRleCkpIT0tMSl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuaW50ZXJuYWxCdWZmZXIpe1xyXG4gICAgICAgICAgICAgICAgY2h1bmsuY29weSh0aGlzLmludGVybmFsQnVmZmVyLHRoaXMuaW50ZXJuYWxCdWZmZXIuYnl0ZUxlbmd0aCxpbmRleCxwb3MrMSk7XHJcbiAgICAgICAgICAgICAgICBidWYyU2VuZD10aGlzLmludGVybmFsQnVmZmVyO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbnRlcm5hbEJ1ZmZlcj1udWxsO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIGJ1ZjJTZW5kPWNodW5rLnNsaWNlKGluZGV4LHBvcysxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnB1c2goYnVmMlNlbmQpO1xyXG4gICAgICAgICAgICBpbmRleD1wb3MrMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pbnRlcm5hbEJ1ZmZlciA9IGNodW5rLnNsaWNlKGluZGV4KTtcclxuICAgICAgICBuZXh0KCk7XHJcbiAgICB9XHJcbiAgICBfZmx1c2goZG9uZTpUcmFuc2Zvcm1DYWxsYmFjayl7XHJcbiAgICAgICAgdGhpcy5wdXNoKHRoaXMuaW50ZXJuYWxCdWZmZXIpO1xyXG4gICAgICAgIGRvbmUoKTtcclxuICAgIH1cclxufSAgICAgICAgICBcclxuXHJcbmV4cG9ydCB0eXBlIEVzY2FwZUNoYXJzVHJhbnNmb3JtT3B0aW9ucz17Y2hhcnNUb0VzY2FwZTpzdHJpbmcsIHByZWZpeENoYXI6c3RyaW5nfSAmIFRyYW5zZm9ybU9wdGlvbnM7XHJcblxyXG5leHBvcnQgY2xhc3MgRXNjYXBlQ2hhcnNUcmFuc2Zvcm0gZXh0ZW5kcyBUcmFuc2Zvcm0ge1xyXG4gICAgcHJpdmF0ZSBjaGFyc01hcDp7W2tleTpzdHJpbmddOiB0cnVlfTtcclxuICAgIHByaXZhdGUgcHJlZml4QnVmZmVyOkJ1ZmZlcjtcclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnM6RXNjYXBlQ2hhcnNUcmFuc2Zvcm1PcHRpb25zKSB7XHJcbiAgICAgICAgdmFyIHtjaGFyc1RvRXNjYXBlLCBwcmVmaXhDaGFyLCAuLi5zdXBlck9wdGlvbnN9ID0gb3B0aW9ucztcclxuICAgICAgICBzdXBlcihzdXBlck9wdGlvbnMpO1xyXG4gICAgICAgIHRoaXMucHJlZml4QnVmZmVyPUJ1ZmZlci5hbGxvYygxLHByZWZpeENoYXIpO1xyXG4gICAgICAgIHRoaXMuY2hhcnNNYXA9e307XHJcbiAgICAgICAgdmFyIHNlbGY9dGhpcztcclxuICAgICAgICBjaGFyc1RvRXNjYXBlLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uKGNoYXIpe1xyXG4gICAgICAgICAgICB2YXIgYXNjaWk6bnVtYmVyPWNoYXIuY2hhckNvZGVBdCgwKTtcclxuICAgICAgICAgICAgc2VsZi5jaGFyc01hcFthc2NpaV09dHJ1ZTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgX3RyYW5zZm9ybShjaHVuazpCdWZmZXIsIF9lbmNvZGluZzpzdHJpbmcsIG5leHQ6VHJhbnNmb3JtQ2FsbGJhY2spe1xyXG4gICAgICAgIHZhciBpbmRleD0wO1xyXG4gICAgICAgIHZhciBwb3M9MDtcclxuICAgICAgICB3aGlsZShwb3M8Y2h1bmsuYnl0ZUxlbmd0aCl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuY2hhcnNNYXBbY2h1bmtbcG9zXV0pe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wdXNoKGNodW5rLnNsaWNlKGluZGV4LCBwb3MpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucHVzaCh0aGlzLnByZWZpeEJ1ZmZlcik7XHJcbiAgICAgICAgICAgICAgICBpbmRleD1wb3M7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcG9zKys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucHVzaChjaHVuay5zbGljZShpbmRleCkpO1xyXG4gICAgICAgIG5leHQoKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZvckVuZE9mKHN0cmVhbTpTdHJlYW0pOlByb21pc2U8dm9pZD57XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcclxuICAgICAgICBzdHJlYW0ub24oJ2Vycm9yJywgcmVqZWN0KTtcclxuICAgICAgICBzdHJlYW0ub24oJ2Nsb3NlJywgcmVzb2x2ZSlcclxuICAgIH0pO1xyXG59XHJcbiJdfQ==