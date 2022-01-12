/// <reference types="node" />
import Writer from './writer';
/**
 * Writes output to a stream.
 */
export default class StreamWriter extends Writer {
    readonly stream: NodeJS.WritableStream;
    constructor(stream: NodeJS.WritableStream);
    write(s: string): this;
    close(cb: () => void): void;
}
