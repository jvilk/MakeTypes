import Writer from './writer';

/**
 * Writes output to a stream.
 */
export default class StreamWriter extends Writer {
  public readonly stream: NodeJS.WritableStream;
  constructor(stream: NodeJS.WritableStream) {
    super();
    this.stream = stream;
  }
  public write(s: string): this {
    this.stream.write(Buffer.from(s, 'utf8'));
    return this;
  }
  public close(cb: () => void): void {
    this.stream.end();
    setTimeout(cb, 4);
  }
}
