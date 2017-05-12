import {parseEquals, parseThrows} from './common/util';
import {OptionalField} from './generated/OptionalField';
import {OptionalFieldProxy} from './generated/OptionalFieldProxy';
import {FieldNames} from './generated/FieldNames';
import {FieldNamesProxy} from './generated/FieldNamesProxy';

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
  it("Field names with underscores", () => {
    const optfields: FieldNames[] = [{
      "lower1": 3,
      "lower2": { "x" : 3},
      "Upper1": 4,
      "Upper2": { "y" : 3},
      "_lower1": 3,
      "_lower2": { "x2" : 3},
      "_Upper1": 4,
      "_Upper2": { "y2" : 3},
      "_underscore1": 5,
      "_underscore2": { "z": 5 },
      "TwoComponents1": 6,
      "TwoComponents2": { "v" : 6 },
      "Underscore_Separates1": 7,
      "Underscore_Separates2": { "m" : 7},
      "_Underscore_Separates1": 7,
      "_Underscore_Separates2": { "m2" : 7},
      "_Underscore_prefix1" : 8,
      "_Underscore_prefix2" : { "n" : 7},
      "_Underscore_Prefix1" : 8,
      "_Underscore_Prefix2" : { "p" : 7},
      "_UnderscorePrefix1" : 8,
      "_UnderscorePrefix2" : { "q" : 7},
      "underscore_Separates1": 7,
      "underscore_Separates2": { "a" : 7},
      "_underscore_prefix1" : 8,
      "_underscore_prefix2" : { "b" : 7}
    }];
    optfields.forEach((optfield) => {
      parseEquals<FieldNames>(FieldNamesProxy, JSON.stringify(optfield), optfield);
    });
    parseThrows(FieldNamesProxy, 'null');
  });
});