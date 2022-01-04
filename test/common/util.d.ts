export interface Proxy<T> {
    Parse(s: string): T;
}
export declare function parseEquals<T>(proxy: Proxy<T>, s: string, expected: T): void;
export declare function parseThrows<T>(proxy: Proxy<T>, s: string): void;
