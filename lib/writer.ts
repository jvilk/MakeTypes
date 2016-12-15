abstract class Writer {
  private readonly _tab: string;
  private readonly _nl: string;
  constructor (tab: string = "  ", newline = "\n") {
    this._tab = tab;
    this._nl = newline;
  }
  public abstract write(s: string): this;
  public abstract close(cb: () => void): void;
  // Tab n times
  public tab(n: number): this {
    for (let i = 0; i < n; i++) {
      this.write(this._tab);
    }
    return this;
  }
  // End current line.
  public endl(): this {
    return this.write(this._nl);
  }
  public writeln(s: string): this {
    return this.write(s).endl();
  }
}
export default Writer;
