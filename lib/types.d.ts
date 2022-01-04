import { default as Emitter } from './emit';
export declare const enum BaseShape {
    BOTTOM = 0,
    NULL = 1,
    RECORD = 2,
    STRING = 3,
    BOOLEAN = 4,
    NUMBER = 5,
    COLLECTION = 6,
    ANY = 7
}
export declare type Shape = CBottomShape | CNullShape | CRecordShape | CStringShape | CBooleanShape | CNumberShape | CCollectionShape | CAnyShape;
export declare const enum ContextType {
    ENTITY = 0,
    FIELD = 1
}
export declare function getReferencedRecordShapes(e: Emitter, s: Set<CRecordShape>, sh: Shape): void;
export declare class FieldContext {
    readonly type: ContextType.FIELD;
    readonly parent: CRecordShape;
    readonly field: string;
    constructor(parent: CRecordShape, field: string);
    getName(e: Emitter): string;
}
export declare class EntityContext {
    readonly type: ContextType.ENTITY;
    readonly parent: CCollectionShape;
    constructor(parent: CCollectionShape);
    getName(e: Emitter): string;
}
export declare type Context = FieldContext | EntityContext;
export declare class CBottomShape {
    readonly type: BaseShape.BOTTOM;
    readonly nullable: boolean;
    makeNullable(): CBottomShape;
    makeNonNullable(): CBottomShape;
    emitType(e: Emitter): void;
    getProxyType(e: Emitter): string;
    equal(t: Shape): boolean;
}
export declare const BottomShape: CBottomShape;
export declare class CNullShape {
    readonly nullable: boolean;
    readonly type: BaseShape.NULL;
    makeNullable(): CNullShape;
    makeNonNullable(): CNullShape;
    emitType(e: Emitter): void;
    getProxyType(e: Emitter): string;
    equal(t: Shape): boolean;
}
export declare const NullShape: CNullShape;
export declare class CNumberShape {
    readonly nullable: boolean;
    readonly type: BaseShape.NUMBER;
    makeNullable(): CNumberShape;
    makeNonNullable(): CNumberShape;
    emitType(e: Emitter): void;
    getProxyType(e: Emitter): string;
    equal(t: Shape): boolean;
}
export declare const NumberShape: CNumberShape;
export declare const NullableNumberShape: CNumberShape;
export declare class CStringShape {
    readonly type: BaseShape.STRING;
    readonly nullable: boolean;
    makeNullable(): CStringShape;
    makeNonNullable(): CStringShape;
    emitType(e: Emitter): void;
    getProxyType(e: Emitter): string;
    equal(t: Shape): boolean;
}
export declare const StringShape: CStringShape;
export declare const NullableStringShape: CStringShape;
export declare class CBooleanShape {
    readonly type: BaseShape.BOOLEAN;
    readonly nullable: boolean;
    makeNullable(): CBooleanShape;
    makeNonNullable(): CBooleanShape;
    emitType(e: Emitter): void;
    getProxyType(e: Emitter): string;
    equal(t: Shape): boolean;
}
export declare const BooleanShape: CBooleanShape;
export declare const NullableBooleanShape: CBooleanShape;
export declare class CAnyShape {
    readonly type: BaseShape.ANY;
    private readonly _shapes;
    private readonly _nullable;
    private _hasDistilledShapes;
    private _distilledShapes;
    constructor(shapes: Shape[], nullable: boolean);
    readonly nullable: boolean;
    makeNullable(): CAnyShape;
    makeNonNullable(): CAnyShape;
    private _ensureDistilled;
    getDistilledShapes(e: Emitter): Shape[];
    addToShapes(shape: Shape): CAnyShape;
    emitType(e: Emitter): void;
    getProxyType(e: Emitter): string;
    equal(t: Shape): boolean;
}
export declare class CRecordShape {
    readonly type: BaseShape.RECORD;
    private readonly _nullable;
    private readonly _fields;
    readonly contexts: Context[];
    private _name;
    private constructor();
    readonly nullable: boolean;
    /**
     * Construct a new record shape. Returns an existing, equivalent record shape
     * if applicable.
     */
    static Create(e: Emitter, fields: Map<string, Shape>, nullable: boolean, contexts?: Context[]): CRecordShape;
    makeNullable(): CRecordShape;
    addContext(ctx: Context): CRecordShape;
    makeNonNullable(): CRecordShape;
    forEachField(cb: (t: Shape, name: string) => any): void;
    getField(name: string): Shape;
    equal(t: Shape): boolean;
    emitType(e: Emitter): void;
    getProxyClass(e: Emitter): string;
    getProxyType(e: Emitter): string;
    emitInterfaceDefinition(e: Emitter): void;
    emitProxyClass(e: Emitter): void;
    getReferencedRecordShapes(e: Emitter, rv: Set<CRecordShape>): void;
    markAsRoot(name: string): void;
    getName(e: Emitter): string;
}
export declare class CCollectionShape {
    readonly type: BaseShape.COLLECTION;
    readonly baseShape: Shape;
    readonly contexts: Context[];
    private _name;
    constructor(baseShape: Shape, contexts?: Context[]);
    readonly nullable: boolean;
    makeNullable(): CCollectionShape;
    makeNonNullable(): CCollectionShape;
    addContext(ctx: Context): CCollectionShape;
    emitType(e: Emitter): void;
    getProxyType(e: Emitter): string;
    equal(t: Shape): boolean;
    getName(e: Emitter): string;
}
export declare function csh(e: Emitter, s1: Shape, s2: Shape): Shape;
export declare function d2s(e: Emitter, d: any): Shape;
