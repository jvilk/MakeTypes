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
 * Writes output to a stream.
 */
var StreamWriter = /** @class */ (function (_super) {
    __extends(StreamWriter, _super);
    function StreamWriter(stream) {
        var _this = _super.call(this) || this;
        _this.stream = stream;
        return _this;
    }
    StreamWriter.prototype.write = function (s) {
        this.stream.write(new Buffer(s, 'utf8'));
        return this;
    };
    StreamWriter.prototype.close = function (cb) {
        this.stream.end();
        setTimeout(cb, 4);
    };
    return StreamWriter;
}(writer_1.default));
exports.default = StreamWriter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyZWFtX3dyaXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0cmVhbV93cml0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQThCO0FBRTlCOztHQUVHO0FBQ0g7SUFBMEMsZ0NBQU07SUFFOUMsc0JBQVksTUFBNkI7UUFBekMsWUFDRSxpQkFBTyxTQUVSO1FBREMsS0FBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7O0lBQ3ZCLENBQUM7SUFDTSw0QkFBSyxHQUFaLFVBQWEsQ0FBUztRQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUN6QyxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFDTSw0QkFBSyxHQUFaLFVBQWEsRUFBYztRQUN6QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLFVBQVUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDcEIsQ0FBQztJQUNILG1CQUFDO0FBQUQsQ0FBQyxBQWRELENBQTBDLGdCQUFNLEdBYy9DIn0=