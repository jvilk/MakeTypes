import {parseEquals, parseThrows} from './common/util';
import {OptionalField} from './generated/OptionalField';
import {OptionalFieldProxy} from './generated/OptionalFieldProxy';

describe("Records", () => {
  it("Optional fields", () => {
    const optfields: OptionalField[] = [{}, {
      foo: 3
    }, {
      bar: 3
    }, {
      foo: 3, bar: 4
    }];
    optfields.forEach((optfield) => {
      parseEquals<OptionalField>(OptionalFieldProxy, JSON.stringify(optfield), optfield);
    });
    parseThrows(OptionalFieldProxy, 'null');
  });
});