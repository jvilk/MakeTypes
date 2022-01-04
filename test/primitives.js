"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./common/util");
var NumberProxy_1 = require("./generated/NumberProxy");
var NumbersProxy_1 = require("./generated/NumbersProxy");
var StringProxy_1 = require("./generated/StringProxy");
var StringsProxy_1 = require("./generated/StringsProxy");
var BooleanProxy_1 = require("./generated/BooleanProxy");
var BooleansProxy_1 = require("./generated/BooleansProxy");
var NullProxy_1 = require("./generated/NullProxy");
var NullsProxy_1 = require("./generated/NullsProxy");
var MaybeNumberProxy_1 = require("./generated/MaybeNumberProxy");
var BooleanOrStringProxy_1 = require("./generated/BooleanOrStringProxy");
describe('Primitive Types', function () {
    it('Number', function () {
        [NumberProxy_1.NumberProxy, NumbersProxy_1.NumbersProxy].forEach(function (proxy) {
            util_1.parseEquals(proxy, '3', 3);
            util_1.parseThrows(proxy, '"hello"');
            util_1.parseThrows(proxy, '[]');
            util_1.parseThrows(proxy, '[3]');
            util_1.parseThrows(proxy, "null");
        });
        {
            var n = 3;
            var m = n;
            var m2 = n;
            var n2 = m;
            n2 = m2;
        }
    });
    it('String', function () {
        [StringProxy_1.StringProxy, StringsProxy_1.StringsProxy].forEach(function (proxy) {
            util_1.parseEquals(proxy, "\"hello\"", "hello");
            util_1.parseThrows(proxy, "3");
            util_1.parseThrows(proxy, '[]');
            util_1.parseThrows(proxy, "null");
        });
        {
            var s = "hello";
            var m = s;
            var m2 = s;
            var s2 = m;
            s2 = m2;
        }
    });
    it('Boolean', function () {
        [BooleanProxy_1.BooleanProxy, BooleansProxy_1.BooleansProxy].forEach(function (proxy) {
            util_1.parseEquals(proxy, "true", true);
            util_1.parseEquals(proxy, "false", false);
            util_1.parseThrows(proxy, "\"true\"");
            util_1.parseThrows(proxy, "[]");
            util_1.parseThrows(proxy, "null");
        });
        {
            var b = true;
            var m = b;
            var m2 = b;
            var b2 = m;
            b2 = m2;
        }
    });
    it('Null', function () {
        [NullProxy_1.NullProxy, NullsProxy_1.NullsProxy].forEach(function (proxy) {
            util_1.parseEquals(proxy, "null", null);
            util_1.parseThrows(proxy, "\"null\"");
            util_1.parseThrows(proxy, "[]");
            util_1.parseThrows(proxy, "3");
        });
        {
            var n = null;
            var m = n;
            var m2 = n;
            var n2 = m;
            n2 = m2;
        }
    });
    it('Optional number', function () {
        util_1.parseEquals(MaybeNumberProxy_1.MaybeNumberProxy, "null", null);
        util_1.parseEquals(MaybeNumberProxy_1.MaybeNumberProxy, "3", 3);
        util_1.parseThrows(MaybeNumberProxy_1.MaybeNumberProxy, "[]");
        util_1.parseThrows(MaybeNumberProxy_1.MaybeNumberProxy, "\"hello\"");
        var n = 3;
        var m = n;
        m = null;
    });
    it("Boolean or string", function () {
        util_1.parseEquals(BooleanOrStringProxy_1.BooleanOrStringProxy, "true", true);
        util_1.parseEquals(BooleanOrStringProxy_1.BooleanOrStringProxy, "\"hello\"", "hello");
        util_1.parseThrows(BooleanOrStringProxy_1.BooleanOrStringProxy, '[]');
        var b = true;
        var s = "hello";
        var bs = b;
        bs = s;
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpbWl0aXZlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByaW1pdGl2ZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBdUQ7QUFDdkQsdURBQW9EO0FBQ3BELHlEQUFzRDtBQUd0RCx1REFBb0Q7QUFFcEQseURBQXNEO0FBRXRELHlEQUFzRDtBQUN0RCwyREFBd0Q7QUFHeEQsbURBQWdEO0FBQ2hELHFEQUFrRDtBQUdsRCxpRUFBOEQ7QUFFOUQseUVBQXNFO0FBR3RFLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTtJQUMxQixFQUFFLENBQUMsUUFBUSxFQUFFO1FBQ1gsQ0FBQyx5QkFBVyxFQUFFLDJCQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLO1lBQ3hDLGtCQUFXLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMzQixrQkFBVyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztZQUM5QixrQkFBVyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN6QixrQkFBVyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztZQUMxQixrQkFBVyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM3QixDQUFDLENBQUMsQ0FBQztRQUVIO1lBQ0UsSUFBTSxDQUFDLEdBQVcsQ0FBQyxDQUFDO1lBQ3BCLElBQU0sQ0FBQyxHQUFXLENBQUMsQ0FBQztZQUNwQixJQUFNLEVBQUUsR0FBWSxDQUFDLENBQUM7WUFDdEIsSUFBSSxFQUFFLEdBQVcsQ0FBQyxDQUFDO1lBQ25CLEVBQUUsR0FBRyxFQUFFLENBQUM7U0FDVDtJQUNILENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLFFBQVEsRUFBRTtRQUNYLENBQUMseUJBQVcsRUFBRSwyQkFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztZQUN4QyxrQkFBVyxDQUFDLEtBQUssRUFBRSxXQUFTLEVBQUUsT0FB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