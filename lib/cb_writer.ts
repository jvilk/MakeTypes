import Writer from './writer';

/**
 * Calls callbacks when written to.
 */
export default class CallbackWriter extends Writer {
  private readonly _writeCb: (s: string) => any;
  private readonly _endCb: () => any;
  constructor(writeCb: (s: string) => any, endCb: () => any) {
    super();
    this._writeCb = writeCb;
    this._endCb = endCb;
  }
  public write(s: string): this {
    this._writeCb(s);
    return this;
  }
  public close(cb: () => void): void {
    this._endCb();
    setTimeout(cb, 4);
  }
}
