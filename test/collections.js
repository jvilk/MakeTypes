"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./common/util");
var PrimitiveArrayProxy_1 = require("./generated/PrimitiveArrayProxy");
var EmptyArrayProxy_1 = require("./generated/EmptyArrayProxy");
var MixedArrayProxy_1 = require("./generated/MixedArrayProxy");
var MixedArray2Proxy_1 = require("./generated/MixedArray2Proxy");
describe("Collections", function () {
    it("Empty arrays", function () {
        var eas = [null, [], [null]];
        eas.forEach(function (ea) { return util_1.parseEquals(EmptyArrayProxy_1.EmptyArrayProxy, JSON.stringify(ea), ea); });
        util_1.parseThrows(EmptyArrayProxy_1.EmptyArrayProxy, JSON.stringify([2]));
    });
    it("Numerical arrays", function () {
        var nas = [null, [1], []];
        nas.forEach(function (na) { return util_1.parseEquals(PrimitiveArrayProxy_1.PrimitiveArrayProxy, JSON.stringify(na), na); });
    });
    it("Mixed type arrays", function () {
        var mta = [
            null,
            [1, 2, 3],
            [true, false],
            [true, 1, false],
            [{ foo: 3 }]
        ];
        var mta2 = mta;
        [MixedArrayProxy_1.MixedArrayProxy, MixedArray2Proxy_1.MixedArray2Proxy].forEach(function (proxy) {
            mta2.forEach(function (mta) {
                util_1.parseEquals(proxy, JSON.stringify(mta), mta);
            });
            util_1.parseThrows(proxy, JSON.stringify(["hello"]));
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sbGVjdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb2xsZWN0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUF1RDtBQUV2RCx1RUFBb0U7QUFFcEUsK0RBQTREO0FBRTVELCtEQUE0RDtBQUU1RCxpRUFBOEQ7QUFFOUQsUUFBUSxDQUFDLGFBQWEsRUFBRTtJQUN0QixFQUFFLENBQUMsY0FBYyxFQUFFO1FBQ2pCLElBQU0sR0FBRyxHQUFpQixDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzdDLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBQyxFQUFFLElBQUssT0FBQSxrQkFBVyxDQUFhLGlDQUFlLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBaEUsQ0FBZ0UsQ0FBQyxDQUFDO1FBQ3RGLGtCQUFXLENBQUMsaUNBQWUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BELENBQUMsQ0FBQyxDQUFDO0lBQ0gsRUFBRSxDQUFDLGtCQUFrQixFQUFFO1FBQ3JCLElBQU0sR0FBRyxHQUFxQixDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzlDLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBQyxFQUFFLElBQUssT0FBQSxrQkFBVyxDQUFpQix5Q0FBbUIsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUF4RSxDQUF3RSxDQUFDLENBQUM7SUFDaEcsQ0FBQyxDQUFDLENBQUM7SUFDSCxFQUFFLENBQUMsbUJBQW1CLEVBQUU7UUFDdEIsSUFBTSxHQUFHLEdBQWlCO1lBQ3hCLElBQUk7WUFDSixDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDO1lBQ2IsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQztZQUNoQixDQUFDLEVBQUMsR0FBRyxFQUFFLENBQUMsRUFBQyxDQUFDO1NBQ1gsQ0FBQztRQUNGLElBQU0sSUFBSSxHQUFrQixHQUFHLENBQUM7UUFDaEMsQ0FBQyxpQ0FBZSxFQUFFLG1DQUFnQixDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztZQUNoRCxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRztnQkFDZixrQkFBVyxDQUFhLEtBQUssRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQzNELENBQUMsQ0FBQyxDQUFDO1lBQ0gsa0JBQVcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==