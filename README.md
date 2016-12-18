# MakeTypes

> Make TypeScript types and proxy objects from example JSON objects. Can use proxy objects to dynamically type check JSON at runtime.

With MakeTypes, you can interact with REST endpoints and other sources of JSON with confidence that the fields you need are present on the JSON
object. MakeTypes generates proxies that enforce JSON types at runtime.

All you need is a file containing sample JSON objects.

## Install

    npm i -g maketypes

## Build

    npm install

## Usage

First, write a file called `samples.json` that contains JSON samples for a particular object type, such as the value returned from a web service. It can either contain a single sample or an array of samples.

Then, run:

    make_types -i interfaces.ts -p proxies.ts samples.json RootName

...where:

* `interfaces.ts` will hold interface definitions for the JSON (optional)
* `proxies.ts` will hold proxy class definitions that you can use to dynamically type check JSON objects at runtime (optional)
* `RootName` specifies the name to use for the type that describes the JSON object

MakeTypes will use simple heuristics to determine the names of nested sub-types.

### Using Proxies

MakeTypes generates proxy classes that dynamically check that runtime JSON objects match the static type.
They also standardize optional/nullable fields to contain `null` rather than `null` or `undefined`.

Example `samples.json`:

```json
[
  {
    "foo": "lalala"
  },
  {
    "foo": "hello",
    "baz": 32
  }
]
```

Generation command:

    make_types -p proxies.ts samples.json RootName

Proxy generated from example:

```typescript
export class RootNameProxy {
  public readonly foo: string;
  public readonly baz: number | null;
  public static Create(d: any): RootNameProxy {
    if (d === null || d === undefined) {
      throwNull2NonNull("RootName");
    } else if (typeof(d) !== 'object') {
      throwNotObject("RootName");
    } else if (Array.isArray(d)) {
      throwIsArray("RootName");
    }
    return new RootNameProxy(d);
  }
  private constructor(d: any) {
    checkString(d.foo, false);
    this.foo = d.foo;
    checkNumber(d.baz, true);
    if (d.baz === undefined) {
      d.baz = null;
    }
    this.baz = d.baz;
  }
}
```

Example TypeScript code using proxy class:

```typescript
import {RootNameProxy} from './proxies';

const rawJson = JSON.parse('{"foo": "bar"}');
// RootName.Create will throw an exception if rawJson does not match the type of RootName.
const proxyObject = RootNameProxy.Create(rawJson);
// Now, you can access all of the properties of the JSON object with confidence that they
// actually exist.
let foo = proxyObject.foo; // TypeScript knows foo is a string
// If one of the properties on the proxy is optional, then it will have a null value.
let baz = proxyObject.baz; // TypeScript knows baz is number | null
```

### Using Interfaces

For a lighterweight option that provides no runtime guarantees, MakeTypes can also generate TypeScript interfaces that describe the expected structure of
JSON objects. You can use these interfaces to typecheck code that interacts with JSON objects, but they cannot check if the JSON objects obey the static
type at runtime.

Example `samples.json`:

```json
[
  {
    "foo": "lalala"
  },
  {
    "foo": "hello",
    "baz": 32
  }
]
```

Generation command:

    make_types -i interfaces.ts samples.json RootName

Interface generated from example:

```typescript
export interface RootName {
  foo: string;
  baz?: number | null;
}
```

Example TypeScript code using interfaces:

```typescript
import {RootName} from './interfaces';

const rawJson = <RootName> JSON.parse('{"foo": "bar"}');
let foo = rawJson.foo; // TypeScript knows foo i a string
let baz = rawJson.baz; // TypeScript thinks that baz is number | null, but it could also be undefined...
```

## Inspiration / Technique

MakeTypes uses the Common Preferred Shape Relation from Petricek et al.'s PLDI 2016 paper, ["Types from Data: Making Structured Data First-Class Citizens in F#"](https://dl.acm.org/citation.cfm?id=2908115).
Since JavaScript/TypeScript lacks a distinction between integer and floating point types, we merge the `float` and `int` types into a `number` type.
