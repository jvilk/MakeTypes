import * as assert from 'assert';

export interface Proxy<T> {
  Parse(s: string): T;
}

class Context {
  public readonly fail: boolean;
  public readonly prop: string;
  public readonly msg: string;
  constructor(fail: boolean, prop: string, msg: string) {
    this.fail = fail;
    this.prop = prop;
    this.msg = msg;
  }
  public or(test: () => boolean, msg: string): Context {
    if (!this.fail) {
      return new Context(test(), this.prop, msg);
    } else {
      return this;
    }
  }
}

function equal(expected: any, actual: any, prop: string): Context {
  if (expected === null || typeof(expected) !== "object") {
    return new Context(expected !== actual, prop, `${expected} !== ${actual}`);
  }
  if (Array.isArray(expected)) {
    const ctx = new Context(!Array.isArray(actual), prop, 'Expected an array.')
      .or(() => actual.length !== expected.length, `Array lengths do not match.`);
    if (!ctx.fail) {
      for (let i = 0; i < expected.length; i++) {
        const ctx = equal(expected[i], actual[i], `${prop}[${i}]`);
        if (ctx.fail) {
          return ctx;
        }
      }
      return new Context(false, prop, '');
    } else {
      return ctx;
    }
  } else {
    const keys = Object.keys(expected);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const ctx = equal(expected[key], actual[key], `${prop}.${key}`);
      if (ctx.fail) {
        return ctx;
      }
    }
    return new Context(false, prop, '');
  }
}

export function parseEquals<T>(proxy: Proxy<T>, s: string, expected: T): void {
  const d = proxy.Parse(s);
  const ctx = equal(expected, d, 'root');
  assert(!ctx.fail, `Property ${ctx.prop} does not match: ${ctx.msg}`);
}

export function parseThrows<T>(proxy: Proxy<T>, s: string): void {
  let threw = false;
  try {
    proxy.Parse(s);
  } catch (e) {
    threw = true;
  }
  assert(threw);
}
