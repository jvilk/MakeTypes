import Writer from './writer';
/**
 * Calls callbacks when written to.
 */
export default class CallbackWriter extends Writer {
    private readonly _writeCb;
    private readonly _endCb;
    constructor(writeCb: (s: string) => any, endCb: () => any);
    write(s: string): this;
    close(cb: () => void): void;
}
