"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var writer_1 = require("./writer");
/**
 * Calls callbacks when written to.
 */
var CallbackWriter = /** @class */ (function (_super) {
    __extends(CallbackWriter, _super);
    function CallbackWriter(writeCb, endCb) {
        var _this = _super.call(this) || this;
        _this._writeCb = writeCb;
        _this._endCb = endCb;
        return _this;
    }
    CallbackWriter.prototype.write = function (s) {
        this._writeCb(s);
        return this;
    };
    CallbackWriter.prototype.close = function (cb) {
        this._endCb();
        setTimeout(cb, 4);
    };
    return CallbackWriter;
}(writer_1.default));
exports.default = CallbackWriter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2Jfd3JpdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2Jfd3JpdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLG1DQUE4QjtBQUU5Qjs7R0FFRztBQUNIO0lBQTRDLGtDQUFNO0lBR2hELHdCQUFZLE9BQTJCLEVBQUUsS0FBZ0I7UUFBekQsWUFDRSxpQkFBTyxTQUdSO1FBRkMsS0FBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7UUFDeEIsS0FBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7O0lBQ3RCLENBQUM7SUFDTSw4QkFBSyxHQUFaLFVBQWEsQ0FBUztRQUNwQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNNLDhCQUFLLEdBQVosVUFBYSxFQUFjO1FBQ3pCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNkLFVBQVUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDcEIsQ0FBQztJQUNILHFCQUFDO0FBQUQsQ0FBQyxBQWhCRCxDQUE0QyxnQkFBTSxHQWdCakQifQ==