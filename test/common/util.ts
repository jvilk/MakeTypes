import * as assert from 'assert';

export interface Proxy<T> {
  Parse(s: string): T;
}

export function parseEquals<T>(proxy: Proxy<T>, s: string, expected: T): void {
  const d = proxy.Parse(s);
  assert.deepStrictEqual(d, expected);
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
