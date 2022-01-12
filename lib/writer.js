"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Writer = /** @class */ (function () {
    function Writer(tab, newline) {
        if (tab === void 0) { tab = "  "; }
        if (newline === void 0) { newline = "\n"; }
        this._tab = tab;
        this._nl = newline;
    }
    // Tab n times
    Writer.prototype.tab = function (n) {
        for (var i = 0; i < n; i++) {
            this.write(this._tab);
        }
        return this;
    };
    // End current line.
    Writer.prototype.endl = function () {
        return this.write(this._nl);
    };
    Writer.prototype.writeln = function (s) {
        return this.write(s).endl();
    };
    return Writer;
}());
exports.default = Writer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3JpdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsid3JpdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7SUFHRSxnQkFBYSxHQUFrQixFQUFFLE9BQWM7UUFBbEMsb0JBQUEsRUFBQSxVQUFrQjtRQUFFLHdCQUFBLEVBQUEsY0FBYztRQUM3QyxJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUNoQixJQUFJLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQztJQUNyQixDQUFDO0lBR0QsY0FBYztJQUNQLG9CQUFHLEdBQVYsVUFBVyxDQUFTO1FBQ2xCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDMUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdkI7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFDRCxvQkFBb0I7SUFDYixxQkFBSSxHQUFYO1FBQ0UsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBQ00sd0JBQU8sR0FBZCxVQUFlLENBQVM7UUFDdEIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFDSCxhQUFDO0FBQUQsQ0FBQyxBQXZCRCxJQXVCQztBQUNELGtCQUFlLE1BQU0sQ0FBQyJ9