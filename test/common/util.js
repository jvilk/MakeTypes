"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var Context = /** @class */ (function () {
    function Context(fail, prop, msg) {
        this.fail = fail;
        this.prop = prop;
        this.msg = msg;
    }
    Context.prototype.or = function (test, msg) {
        if (!this.fail) {
            return new Context(test(), this.prop, msg);
        }
        else {
            return this;
        }
    };
    return Context;
}());
function equal(expected, actual, prop) {
    if (expected === null || typeof (expected) !== "object") {
        return new Context(expected !== actual, prop, expected + " !== " + actual);
    }
    if (Array.isArray(expected)) {
        var ctx = new Context(!Array.isArray(actual), prop, 'Expected an array.')
            .or(function () { return actual.length !== expected.length; }, "Array lengths do not match.");
        if (!ctx.fail) {
            for (var i = 0; i < expected.length; i++) {
                var ctx_1 = equal(expected[i], actual[i], prop + "[" + i + "]");
                if (ctx_1.fail) {
                    return ctx_1;
                }
            }
            return new Context(false, prop, '');
        }
        else {
            return ctx;
        }
    }
    else {
        var keys = Object.keys(expected);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var ctx = equal(expected[key], actual[key], prop + "." + key);
            if (ctx.fail) {
                return ctx;
            }
        }
        return new Context(false, prop, '');
    }
}
function parseEquals(proxy, s, expected) {
    var d = proxy.Parse(s);
    var ctx = equal(expected, d, 'root');
    assert(!ctx.fail, "Property " + ctx.prop + " does not match: " + ctx.msg);
}
exports.parseEquals = parseEquals;
function parseThrows(proxy, s) {
    var threw = false;
    try {
        proxy.Parse(s);
    }
    catch (e) {
        threw = true;
    }
    assert(threw);
}
exports.parseThrows = parseThrows;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBaUM7QUFNakM7SUFJRSxpQkFBWSxJQUFhLEVBQUUsSUFBWSxFQUFFLEdBQVc7UUFDbEQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFDakIsQ0FBQztJQUNNLG9CQUFFLEdBQVQsVUFBVSxJQUFtQixFQUFFLEdBQVc7UUFDeEMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDZCxPQUFPLElBQUksT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDNUM7YUFBTTtZQUNMLE9BQU8sSUFBSSxDQUFDO1NBQ2I7SUFDSCxDQUFDO0lBQ0gsY0FBQztBQUFELENBQUMsQUFoQkQsSUFnQkM7QUFFRCxlQUFlLFFBQWEsRUFBRSxNQUFXLEVBQUUsSUFBWTtJQUNyRCxJQUFJLFFBQVEsS0FBSyxJQUFJLElBQUksT0FBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLFFBQVEsRUFBRTtRQUN0RCxPQUFPLElBQUksT0FBTyxDQUFDLFFBQVEsS0FBSyxNQUFNLEVBQUUsSUFBSSxFQUFLLFFBQVEsYUFBUSxNQUFRLENBQUMsQ0FBQztLQUM1RTtJQUNELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRTtRQUMzQixJQUFNLEdBQUcsR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLG9CQUFvQixDQUFDO2FBQ3hFLEVBQUUsQ0FBQyxjQUFNLE9BQUEsTUFBTSxDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUMsTUFBTSxFQUFqQyxDQUFpQyxFQUFFLDZCQUE2QixDQUFDLENBQUM7UUFDOUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7WUFDYixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDeEMsSUFBTSxLQUFHLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUssSUFBSSxTQUFJLENBQUMsTUFBRyxDQUFDLENBQUM7Z0JBQzNELElBQUksS0FBRyxDQUFDLElBQUksRUFBRTtvQkFDWixPQUFPLEtBQUcsQ0FBQztpQkFDWjthQUNGO1lBQ0QsT0FBTyxJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQ3JDO2FBQU07WUFDTCxPQUFPLEdBQUcsQ0FBQztTQUNaO0tBQ0Y7U0FBTTtRQUNMLElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDbkMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDcEMsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLElBQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFLLElBQUksU0FBSSxHQUFLLENBQUMsQ0FBQztZQUNoRSxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUU7Z0JBQ1osT0FBTyxHQUFHLENBQUM7YUFDWjtTQUNGO1FBQ0QsT0FBTyxJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQ3JDO0FBQ0gsQ0FBQztBQUVELHFCQUErQixLQUFlLEVBQUUsQ0FBUyxFQUFFLFFBQVc7SUFDcEUsSUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6QixJQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN2QyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLGNBQVksR0FBRyxDQUFDLElBQUkseUJBQW9CLEdBQUcsQ0FBQyxHQUFLLENBQUMsQ0FBQztBQUN2RSxDQUFDO0FBSkQsa0NBSUM7QUFFRCxxQkFBK0IsS0FBZSxFQUFFLENBQVM7SUFDdkQsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ2xCLElBQUk7UUFDRixLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2hCO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDVixLQUFLLEdBQUcsSUFBSSxDQUFDO0tBQ2Q7SUFDRCxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDaEIsQ0FBQztBQVJELGtDQVFDIn0=