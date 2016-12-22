import {parseEquals, parseThrows} from './common/util';
import {PrimitiveArray} from './generated/PrimitiveArray';
import {PrimitiveArrayProxy} from './generated/PrimitiveArrayProxy';
import {EmptyArray} from './generated/EmptyArray';
import {EmptyArrayProxy} from './generated/EmptyArrayProxy';
import {MixedArray} from './generated/MixedArray';
import {MixedArrayProxy} from './generated/MixedArrayProxy';
import {MixedArray2} from './generated/MixedArray2';
import {MixedArray2Proxy} from './generated/MixedArray2Proxy';

describe("Collections", () => {
  it("Empty arrays", () => {
    const eas: EmptyArray[] = [null, [], [null]];
    eas.forEach((ea) => parseEquals<EmptyArray>(EmptyArrayProxy, JSON.stringify(ea), ea));
    parseThrows(EmptyArrayProxy, JSON.stringify([2]));
  });
  it("Numerical arrays", () => {
    const nas: PrimitiveArray[] = [null, [1], []];
    nas.forEach((na) => parseEquals<PrimitiveArray>(PrimitiveArrayProxy, JSON.stringify(na), na));
  });
  it("Mixed type arrays", () => {
    const mta: MixedArray[] = [
      null,
      [1,2,3],
      [true, false],
      [true, 1, false],
      [{foo: 3}]
    ];
    const mta2: MixedArray2[] = mta;
    [MixedArrayProxy, MixedArray2Proxy].forEach((proxy) => {
      mta2.forEach((mta) => {
        parseEquals<MixedArray>(proxy, JSON.stringify(mta), mta);
      });
      parseThrows(proxy, JSON.stringify(["hello"]));
    });
  });
});