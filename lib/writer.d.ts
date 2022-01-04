declare abstract class Writer {
    private readonly _tab;
    private readonly _nl;
    constructor(tab?: string, newline?: string);
    abstract write(s: string): this;
    abstract close(cb: () => void): void;
    tab(n: number): this;
    endl(): this;
    writeln(s: string): this;
}
export default Writer;
