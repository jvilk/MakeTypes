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
 * Does nothing.
 */
var NopWriter = /** @class */ (function (_super) {
    __extends(NopWriter, _super);
    function NopWriter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NopWriter.prototype.write = function (s) {
        return this;
    };
    NopWriter.prototype.close = function (cb) {
        setTimeout(cb, 4);
    };
    return NopWriter;
}(writer_1.default));
exports.default = NopWriter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9wX3dyaXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5vcF93cml0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQThCO0FBRTlCOztHQUVHO0FBQ0g7SUFBdUMsNkJBQU07SUFBN0M7O0lBT0EsQ0FBQztJQU5RLHlCQUFLLEdBQVosVUFBYSxDQUFTO1FBQ3BCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNNLHlCQUFLLEdBQVosVUFBYSxFQUFjO1FBQ3pCLFVBQVUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDcEIsQ0FBQztJQUNILGdCQUFDO0FBQUQsQ0FBQyxBQVBELENBQXVDLGdCQUFNLEdBTzVDIn0=