import {parseEquals, parseThrows} from './common/util';
import {NumberProxy} from './generated/NumberProxy';
import {NumbersProxy} from './generated/NumbersProxy';
import {Number} from './generated/Number';
import {Numbers} from './generated/Numbers';
import {StringProxy} from './generated/StringProxy';
import {String} from './generated/String';
import {StringsProxy} from './generated/StringsProxy';
import {Strings} from './generated/Strings';
import {BooleanProxy} from './generated/BooleanProxy';
import {BooleansProxy} from './generated/BooleansProxy';
import {Boolean} from './generated/Boolean';
import {Booleans} from './generated/Booleans';
import {NullProxy} from './generated/NullProxy';
import {NullsProxy} from './generated/NullsProxy';
import {Null} from './generated/Null';
import {Nulls} from './generated/Nulls';
import {MaybeNumberProxy} from './generated/MaybeNumberProxy';
import {MaybeNumber} from './generated/MaybeNumber';

describe('Primitive Types', () => {
  it('Number', () => {
    [NumberProxy, NumbersProxy].forEach((proxy) => {
      parseEquals(proxy, '3', 3);
      parseThrows(proxy, '"hello"');
      parseThrows(proxy, '[]');
      parseThrows(proxy, '[3]');
      parseThrows(proxy, "null");
    });

    {
      const n: number = 3;
      const m: Number = n;
      const m2: Numbers = n;
      let n2: number = m;
      n2 = m2;
    }
  });

  it('String', () => {
    [StringProxy, StringsProxy].forEach((proxy) => {
      parseEquals(proxy, `"hello"`, "hello");
      parseThrows(proxy, `3`);
      parseThrows(proxy, '[]');
      parseThrows(proxy, "null");
    });
    {
      const s: string = "hello";
      const m: String = s;
      const m2: Strings = s;
      let s2 = m;
      s2 = m2;
    }
  });

  it('Boolean', () => {
    [BooleanProxy, BooleansProxy].forEach((proxy) => {
      parseEquals(proxy, "true", true);
      parseEquals(proxy, "false", false);
      parseThrows(proxy, `"true"`);
      parseThrows(proxy, "[]");
      parseThrows(proxy, "null");
    });

    {
      const b: boolean = true;
      const m: Boolean = b;
      const m2: Booleans = b;
      let b2 = m;
      b2 = m2;
    }
  });

  it('Null', () => {
    [NullProxy, NullsProxy].forEach((proxy) => {
      parseEquals(proxy, `null`, null);
      parseThrows(proxy, `"null"`);
      parseThrows(proxy, `[]`);
      parseThrows(proxy, `3`);
    });
    {
      const n: null = null;
      const m: Null = n;
      const m2: Nulls = n;
      let n2: null = m;
      n2 = m2;
    }
  });

  it('Optional number', () => {
    parseEquals(MaybeNumberProxy, `null`, null);
    parseEquals(MaybeNumberProxy, `3`, 3);
    parseThrows(MaybeNumberProxy, `[]`);
    parseThrows(MaybeNumberProxy, `"hello"`);

    let n: number = 3;
    let m: MaybeNumber = n;
    m = null;
  });
});
