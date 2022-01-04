import Writer from './writer';
import { CRecordShape, Shape } from './types';
export declare function emitProxyTypeCheck(e: Emitter, w: Writer, t: Shape, tabLevel: number, dataVar: string, fieldName: string): void;
export default class Emitter {
    private _records;
    private _claimedNames;
    readonly interfaces: Writer;
    readonly proxies: Writer;
    private _helpersToEmit;
    constructor(interfaces: Writer, proxies: Writer);
    markHelperAsUsed(n: string): void;
    emit(root: any, rootName: string): void;
    private _emitRootRecordShape;
    private _emitProxyHelpers;
    /**
     * Registers the provided shape with the emitter. If an equivalent shape
     * already exists, then the emitter returns the equivalent shape.
     */
    registerRecordShape(s: CRecordShape): CRecordShape;
    /**
     * Registers the provided shape name with the emitter. If another
     * shape has already claimed this name, it returns a similar unique
     * name that should be used instead.
     */
    registerName(name: string): string;
}
