import { default as Emitter, emitProxyTypeCheck } from './emit';

export const enum BaseShape {
  BOTTOM,
  NULL,
  RECORD,
  STRING,
  BOOLEAN,
  NUMBER,
  COLLECTION,
  ANY
}

export type Shape = CBottomShape | CNullShape | CRecordShape | CStringShape | CBooleanShape | CNumberShape | CCollectionShape | CAnyShape;

export const enum ContextType {
  ENTITY,
  FIELD
}

// This is a function because regex are stateful
function invalidIdentifiedRegex(): RegExp {
  return /^\d|[^0-9a-zA-Z$_]/g;
}

function pascalCase(n: string): string {
  return n.split("_").map((s) => (s[0] ? s[0].toUpperCase() : "") + s.slice(1)).join("");
}

export function getReferencedRecordShapes(e: Emitter, s: Set<CRecordShape>, sh: Shape): void {
  switch (sh.type) {
    case BaseShape.RECORD:
      if (!s.has(sh)) {
        s.add(sh);
        sh.getReferencedRecordShapes(e, s);
      }
      break;
    case BaseShape.COLLECTION:
      getReferencedRecordShapes(e, s, sh.baseShape);
      break;
    case BaseShape.ANY:
      sh.getDistilledShapes(e).forEach((sh) => getReferencedRecordShapes(e, s, sh));
      break;
  }
}

export class FieldContext {
  public get type(): ContextType.FIELD {
    return ContextType.FIELD;
  }
  public readonly parent: CRecordShape;
  public readonly field: string;
  constructor(parent: CRecordShape, field: string) {
    this.parent = parent;
    this.field = field;
  }
  public getName(e: Emitter): string {
    const name = pascalCase(this.field);
    return name;
  }
}

export class EntityContext {
  public get type(): ContextType.ENTITY {
    return ContextType.ENTITY;
  }
  public readonly parent: CCollectionShape;
  constructor(parent: CCollectionShape) {
    this.parent = parent;
  }
  public getName(e: Emitter): string {
    return `${this.parent.getName(e)}Entity`;
  }
}

export type Context = FieldContext | EntityContext;

export class CBottomShape {
  public get type(): BaseShape.BOTTOM {
    return BaseShape.BOTTOM;
  }
  public get nullable(): boolean {
    return false;
  }
  public makeNullable(): CBottomShape {
    throw new TypeError(`Doesn't make sense.`);
  }
  public makeNonNullable(): CBottomShape {
    return this;
  }
  public emitType(e: Emitter): void {
    throw new Error(`Doesn't make sense.`);
  }
  public getProxyType(e: Emitter): string {
    throw new Error(`Doesn't make sense.`);
  }
  public equal(t: Shape): boolean {
    return this === t;
  }
}

export const BottomShape = new CBottomShape();

export class CNullShape {
  public get nullable(): boolean {
    return true;
  }
  public get type(): BaseShape.NULL {
    return BaseShape.NULL;
  }
  public makeNullable(): CNullShape {
    return this;
  }
  public makeNonNullable(): CNullShape {
    return this;
  }
  public emitType(e: Emitter): void {
    e.interfaces.write("null");
  }
  public getProxyType(e: Emitter): string {
    return "null";
  }
  public equal(t: Shape): boolean {
    return this === t;
  }
}

export const NullShape = new CNullShape();

export class CNumberShape {
  public get nullable(): boolean {
    return this === NullableNumberShape;
  }
  public get type(): BaseShape.NUMBER {
    return BaseShape.NUMBER;
  }
  public makeNullable(): CNumberShape {
    return NullableNumberShape;
  }
  public makeNonNullable(): CNumberShape {
    return NumberShape;
  }
  public emitType(e: Emitter): void {
    e.interfaces.write(this.getProxyType(e));
  }
  public getProxyType(e: Emitter): string {
    let rv = "number";
    if (this.nullable) {
      rv += " | null";
    }
    return rv;
  }
  public equal(t: Shape): boolean {
    return this === t;
  }
}

export const NumberShape = new CNumberShape();
export const NullableNumberShape = new CNumberShape();

export class CStringShape {
  public get type(): BaseShape.STRING {
    return BaseShape.STRING;
  }
  public get nullable(): boolean {
    return this === NullableStringShape;
  }
  public makeNullable(): CStringShape {
    return NullableStringShape;
  }
  public makeNonNullable(): CStringShape {
    return StringShape;
  }
  public emitType(e: Emitter): void {
    e.interfaces.write(this.getProxyType(e));
  }
  public getProxyType(e: Emitter): string {
    let rv = "string";
    if (this.nullable) {
      rv += " | null";
    }
    return rv;
  }
  public equal(t: Shape): boolean {
    return this === t;
  }
}

export const StringShape = new CStringShape();
export const NullableStringShape = new CStringShape();

export class CBooleanShape {
  public get type(): BaseShape.BOOLEAN {
    return BaseShape.BOOLEAN;
  }
  public get nullable(): boolean {
    return this === NullableBooleanShape;
  }
  public makeNullable(): CBooleanShape {
    return NullableBooleanShape;
  }
  public makeNonNullable(): CBooleanShape {
    return BooleanShape;
  }
  public emitType(e: Emitter): void {
    e.interfaces.write(this.getProxyType(e));
  }
  public getProxyType(e: Emitter): string {
    let rv = "boolean";
    if (this.nullable) {
      rv += " | null";
    }
    return rv;
  }
  public equal(t: Shape): boolean {
    return this === t;
  }
}

export const BooleanShape = new CBooleanShape();
export const NullableBooleanShape = new CBooleanShape();

export class CAnyShape {
  public get type(): BaseShape.ANY {
    return BaseShape.ANY;
  }
  private readonly _shapes: Shape[];
  private readonly _nullable: boolean = false;
  private _hasDistilledShapes: boolean = false;
  private _distilledShapes: Shape[] = [];
  constructor(shapes: Shape[], nullable: boolean) {
    this._shapes = shapes;
    this._nullable = nullable;
  }
  public get nullable(): boolean {
    return this._nullable === true;
  }
  public makeNullable(): CAnyShape {
    if (this._nullable) {
      return this;
    } else {
      return new CAnyShape(this._shapes, true);
    }
  }
  public makeNonNullable(): CAnyShape {
    if (this._nullable) {
      return new CAnyShape(this._shapes, false);
    } else {
      return this;
    }
  }
  private _ensureDistilled(e: Emitter): void {
    if (!this._hasDistilledShapes) {
      let shapes = new Map<BaseShape, Shape[]>();
      for (let i = 0; i < this._shapes.length; i++) {
        const s = this._shapes[i];
        if (!shapes.has(s.type)) {
          shapes.set(s.type, []);
        }
        shapes.get(s.type)!.push(s);
      }
      shapes.forEach((shapes, key) => {
        let shape: Shape = BottomShape;
        for (let i = 0; i < shapes.length; i++) {
          shape = csh(e, shape, shapes[i]);
        }
        this._distilledShapes.push(shape);
      });
      this._hasDistilledShapes = true;
    }
  }
  public getDistilledShapes(e: Emitter): Shape[] {
    this._ensureDistilled(e);
    return this._distilledShapes;
  }
  public addToShapes(shape: Shape): CAnyShape {
    const shapeClone = this._shapes.slice(0);
    shapeClone.push(shape);
    return new CAnyShape(shapeClone, this._nullable);
  }
  public emitType(e: Emitter): void {
    this._ensureDistilled(e);
    this._distilledShapes.forEach((s, i) => {
      s.emitType(e);
      if (i < this._distilledShapes.length - 1) {
        e.interfaces.write(" | ");
      }
    });
  }
  public getProxyType(e: Emitter): string {
    this._ensureDistilled(e);
    return this._distilledShapes.map((s) => s.getProxyType(e)).join(" | ");
  }
  public equal(t: Shape): boolean {
    return this === t;
  }
}

export class CRecordShape {
  public get type(): BaseShape.RECORD {
    return BaseShape.RECORD;
  }
  private readonly _nullable: boolean;
  private readonly _fields: Map<string, Shape>;
  public readonly contexts: Context[];

  private _name: string | null = null;
  private constructor(fields: Map<string, Shape>, nullable: boolean, contexts: Context[]) {
    // Assign a context to all fields.
    const fieldsWithContext = new Map<string, Shape>();
    fields.forEach((val, index) => {
      if (val.type === BaseShape.RECORD || val.type === BaseShape.COLLECTION) {
        fieldsWithContext.set(index, val.addContext(new FieldContext(this, index)));
      } else {
        fieldsWithContext.set(index, val);
      }
    });
    this._fields = fieldsWithContext;
    this._nullable = nullable;
    this.contexts = contexts;
  }
  public get nullable(): boolean {
    return this._nullable;
  }
  /**
   * Construct a new record shape. Returns an existing, equivalent record shape
   * if applicable.
   */
  public static Create(e: Emitter, fields: Map<string, Shape>, nullable: boolean, contexts: Context[] = []): CRecordShape {
    const record = new CRecordShape(fields, nullable, contexts);
    return e.registerRecordShape(record);
  }
  public makeNullable(): CRecordShape {
    if (this._nullable) {
      return this;
    } else {
      return new CRecordShape(this._fields, true, this.contexts);
    }
  }
  public addContext(ctx: Context): CRecordShape {
    this.contexts.push(ctx);
    return this;
  }
  public makeNonNullable(): CRecordShape {
    if (this._nullable) {
      return new CRecordShape(this._fields, false, this.contexts);
    } else {
      return this;
    }
  }
  public forEachField(cb: (t: Shape, name: string) => any): void {
    this._fields.forEach(cb);
  }
  public getField(name: string): Shape {
    const t = this._fields.get(name);
    if (!t) {
      return NullShape;
    } else {
      return t;
    }
  }
  public equal(t: Shape): boolean {
    if (t.type === BaseShape.RECORD && this._nullable === t._nullable && this._fields.size === t._fields.size) {
      let rv = true;
      const tFields = t._fields;
      // Check all fields.
      // NOTE: Since size is equal, no need to iterate over t. Either they have the same fields
      // or t is missing fields from this one.
      this.forEachField((t, name) => {
        if (rv) {
          const field = tFields.get(name);
          if (field) {
            rv = field.equal(t);
          } else {
            rv = false;
          }
        }
      });
      return rv;
    }
    return false;
  }
  public emitType(e: Emitter): void {
    e.interfaces.write(this.getName(e));
    if (this.nullable) {
      e.interfaces.write(" | null");
    }
  }
  public getProxyClass(e: Emitter): string {
    return `${this.getName(e)}Proxy`;
  }
  public getProxyType(e: Emitter): string {
    let rv = `${this.getName(e)}Proxy`;
    if (this.nullable) {
      rv += " | null";
    }
    return rv;
  }
  public emitInterfaceDefinition(e: Emitter): void {
    const w = e.interfaces;
    w.write(`export interface ${this.getName(e)} {`).endl();
    this.forEachField((t, name) => {
      w.tab(1).write(this.sanitizeKeyName(name));
      if (t.nullable) {
        w.write("?");
      }
      w.write(": ");
      t.emitType(e);
      w.write(";").endl();
    });
    w.write(`}`);
  }
  public emitProxyClass(e: Emitter): void {
    const w = e.proxies;
    w.writeln(`export class ${this.getProxyClass(e)} {`);
    this.forEachField((t, name) => {
      w.tab(1).writeln(`public readonly ${this.sanitizeKeyName(name)}: ${t.getProxyType(e)};`);
    });
    w.tab(1).writeln(`public static Parse(d: string): ${this.getProxyType(e)} {`);
    w.tab(2).writeln(`return ${this.getProxyClass(e)}.Create(JSON.parse(d));`);
    w.tab(1).writeln(`}`);
    w.tab(1).writeln(`public static Create(d: any, field: string = 'root'): ${this.getProxyType(e)} {`);
    w.tab(2).writeln(`if (!field) {`);
    w.tab(3).writeln(`obj = d;`);
    w.tab(3).writeln(`field = "root";`);
    w.tab(2).writeln(`}`);
    w.tab(2).writeln(`if (d === null || d === undefined) {`);
    w.tab(3);
    if (this.nullable) {
      w.writeln(`return null;`);
    } else {
      e.markHelperAsUsed('throwNull2NonNull');
      w.writeln(`throwNull2NonNull(field, d);`);
    }
    w.tab(2).writeln(`} else if (typeof(d) !== 'object') {`);
    e.markHelperAsUsed('throwNotObject');
    w.tab(3).writeln(`throwNotObject(field, d, ${this.nullable});`);
    w.tab(2).writeln(`} else if (Array.isArray(d)) {`)
    e.markHelperAsUsed('throwIsArray');
    w.tab(3).writeln(`throwIsArray(field, d, ${this.nullable});`);
    w.tab(2).writeln(`}`);
    // At this point, we know we have a non-null object.
    // Check all fields.
    this.forEachField((t, name) => {
      emitProxyTypeCheck(e, w, t, 2, `d["${name}"]`, `field + "[\\"${name}\\"]"`);
    });
    w.tab(2).writeln(`return new ${this.getProxyClass(e)}(d);`);
    w.tab(1).writeln(`}`);
    w.tab(1).writeln(`private constructor(d: any) {`);
    // Emit an assignment for each field.
    this.forEachField((t, name) => {
      w.tab(2).writeln(`this["${name}"] = d["${name}"];`);
    });
    w.tab(1).writeln(`}`);
    w.writeln('}');
  }
  public getReferencedRecordShapes(e: Emitter, rv: Set<CRecordShape>): void {
    this.forEachField((t, name) => {
      getReferencedRecordShapes(e, rv, t);
    });
  }
  public markAsRoot(name: string): void {
    this._name = name;
  }
  public getName(e: Emitter): string {
    if (typeof (this._name) === 'string') {
      return this.sanitizeTypeName(this._name);
    }
    // Calculate unique name.
    const nameSet = new Set<string>();
    let name = this.contexts
      .map((c) => c.getName(e))
      // Remove duplicate names.
      .filter((n) => {
        if (!nameSet.has(n)) {
          nameSet.add(n);
          return true;
        }
        return false;
      })
      .join("Or");
    name = this.sanitizeTypeName(name);
    this._name = e.registerName(name);
    return this._name;
  }
  public sanitizeKeyName(name: string): string {
    if (invalidIdentifiedRegex().test(name)) {
      return `["${name}"]`;
    }
    return name;
  }
  public sanitizeTypeName(name: string): string {
    // Accept 'a to z', '$' and '_' in any position.
    // Accept '0 to 9' in any position except first.
    // Replace invalid by '_'
    const result = name.replace(invalidIdentifiedRegex(), '_');
    return result;
  }
}

export class CCollectionShape {
  public get type(): BaseShape.COLLECTION {
    return BaseShape.COLLECTION;
  }
  public readonly baseShape: Shape;
  public readonly contexts: Context[];
  private _name: string | null = null;
  constructor(baseShape: Shape, contexts: Context[] = []) {
    // Add context if a record/collection.
    this.baseShape = (baseShape.type === BaseShape.RECORD || baseShape.type === BaseShape.COLLECTION) ? baseShape.addContext(new EntityContext(this)) : baseShape;
    this.contexts = contexts;
  }

  public get nullable(): boolean {
    return true;
  }
  public makeNullable(): CCollectionShape {
    return this;
  }
  public makeNonNullable(): CCollectionShape {
    return this;
  }
  public addContext(ctx: Context): CCollectionShape {
    this.contexts.push(ctx);
    return this;
  }
  public emitType(e: Emitter): void {
    e.interfaces.write("(");
    this.baseShape.emitType(e);
    e.interfaces.write(")[] | null");
  }
  public getProxyType(e: Emitter): string {
    const base = this.baseShape.getProxyType(e);
    if (base.indexOf("|") !== -1) {
      return `(${base})[] | null`;
    } else {
      return `${base}[] | null`;
    }
  }
  public equal(t: Shape): boolean {
    return t.type === BaseShape.COLLECTION && this.baseShape.equal(t.baseShape);
  }
  public getName(e: Emitter): string {
    if (typeof (this._name) === 'string') {
      return this._name;
    }
    const nameSet = new Set<string>();
    // No need to make collection names unique.
    this._name = this.contexts
      .map((c) => c.getName(e))
      .filter((name) => {
        if (!nameSet.has(name)) {
          nameSet.add(name);
          return true;
        }
        return false;
      })
      .join("Or");
    return this._name;
  }
}

// Combine shapes: return s1 + s2
export function csh(e: Emitter, s1: Shape, s2: Shape): Shape {
  // csh(σ, σ) = σ
  if (s1 === s2) {
    return s1;
  }
  if (s1.type === BaseShape.COLLECTION && s2.type === BaseShape.COLLECTION) {
    // csh([σ1], [σ2]) = [csh(σ1, σ2)]
    return new CCollectionShape(csh(e, s1.baseShape, s2.baseShape));
  }
  // csh(⊥, σ) = csh(σ, ⊥) = σ
  if (s1.type === BaseShape.BOTTOM) {
    return s2;
  }
  if (s2.type === BaseShape.BOTTOM) {
    return s1;
  }

  // csh(null, σ) = csh(σ, null) = nullable<σ>
  if (s1.type === BaseShape.NULL) {
    return s2.makeNullable();
  }
  if (s2.type === BaseShape.NULL) {
    return s1.makeNullable();
  }

  // csh(any, σ) = csh(σ, any) = any
  if (s1.type === BaseShape.ANY) {
    return s1.addToShapes(s2);
  }
  if (s2.type === BaseShape.ANY) {
    return s2.addToShapes(s1);
  }

  // csh(σ2, nullable<σˆ1> ) = csh(nullable<σˆ1> , σ2) = nullable<csh(σˆ1, σ2)>
  if (s1.nullable && s1.type !== BaseShape.COLLECTION) {
    return csh(e, s1.makeNonNullable(), s2).makeNullable();
  }
  if (s2.nullable && s2.type !== BaseShape.COLLECTION) {
    return csh(e, s2.makeNonNullable(), s1).makeNullable();
  }

  // (recd) rule
  if (s1.type === BaseShape.RECORD && s2.type === BaseShape.RECORD) {
    // Get all fields.
    const fields = new Map<string, Shape>();
    s1.forEachField((t, name) => {
      fields.set(name, csh(e, t, s2.getField(name)));
    });
    s2.forEachField((t, name) => {
      if (!fields.has(name)) {
        fields.set(name, csh(e, t, s1.getField(name)));
      }
    });
    return CRecordShape.Create(e, fields, false);
  }

  // (any) rule
  return new CAnyShape([s1, s2], s1.nullable || s2.nullable);
}

// returns the Shape for the type `d`
export function d2s(e: Emitter, d: any): Shape {
  if (d === undefined || d === null) {
    return NullShape;
  }
  switch (typeof (d)) {
    case 'number':
      return NumberShape;
    case 'string':
      return StringShape;
    case 'boolean':
      return BooleanShape;
  }

  // Must be an object or array.
  if (Array.isArray(d)) {
    // Empty array: Not enough information to figure out a precise type.
    if (d.length === 0) {
      return new CCollectionShape(NullShape);
    }
    let t: Shape = BottomShape;
    for (let i = 0; i < d.length; i++) {
      t = csh(e, t, d2s(e, d[i]));

    }
    return new CCollectionShape(t);
  }

  const keys = Object.keys(d);
  const fields = new Map<string, Shape>();
  for (let i = 0; i < keys.length; i++) {
    const name = keys[i];
    fields.set(name, d2s(e, d[name]));
  }
  return CRecordShape.Create(e, fields, false);
}
