"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var emit_1 = require("./emit");
// Add any more invalid charachaters here 
var invalidChars = /[0-9-+\*\/\?: ]/g;
function safeField(field) {
    return field.match(invalidChars)
        ? "\"" + field + "\""
        : field;
}
function safeInterfaceName(name) {
    return name.match(invalidChars) ? name.replace(invalidChars, "_") : name;
}
function safeObjectField(objectName, field) {
    return field.match(invalidChars)
        ? objectName + "[\"" + field + "\"]"
        : objectName + "." + field;
}
function pascalCase(n) {
    return n.split("_").map(function (s) { return (s[0] ? s[0].toUpperCase() : "") + s.slice(1); }).join("");
}
function getReferencedRecordShapes(e, s, sh) {
    switch (sh.type) {
        case 2 /* RECORD */:
            if (!s.has(sh)) {
                s.add(sh);
                sh.getReferencedRecordShapes(e, s);
            }
            break;
        case 6 /* COLLECTION */:
            getReferencedRecordShapes(e, s, sh.baseShape);
            break;
        case 7 /* ANY */:
            sh.getDistilledShapes(e).forEach(function (sh) { return getReferencedRecordShapes(e, s, sh); });
            break;
    }
}
exports.getReferencedRecordShapes = getReferencedRecordShapes;
var FieldContext = /** @class */ (function () {
    function FieldContext(parent, field) {
        this.parent = parent;
        this.field = field;
    }
    Object.defineProperty(FieldContext.prototype, "type", {
        get: function () {
            return 1 /* FIELD */;
        },
        enumerable: true,
        configurable: true
    });
    FieldContext.prototype.getName = function (e) {
        var name = pascalCase(this.field);
        return name;
    };
    return FieldContext;
}());
exports.FieldContext = FieldContext;
var EntityContext = /** @class */ (function () {
    function EntityContext(parent) {
        this.parent = parent;
    }
    Object.defineProperty(EntityContext.prototype, "type", {
        get: function () {
            return 0 /* ENTITY */;
        },
        enumerable: true,
        configurable: true
    });
    EntityContext.prototype.getName = function (e) {
        return this.parent.getName(e) + "Entity";
    };
    return EntityContext;
}());
exports.EntityContext = EntityContext;
var CBottomShape = /** @class */ (function () {
    function CBottomShape() {
    }
    Object.defineProperty(CBottomShape.prototype, "type", {
        get: function () {
            return 0 /* BOTTOM */;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CBottomShape.prototype, "nullable", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    CBottomShape.prototype.makeNullable = function () {
        throw new TypeError("Doesn't make sense.");
    };
    CBottomShape.prototype.makeNonNullable = function () {
        return this;
    };
    CBottomShape.prototype.emitType = function (e) {
        throw new Error("Doesn't make sense.");
    };
    CBottomShape.prototype.getProxyType = function (e) {
        throw new Error("Doesn't make sense.");
    };
    CBottomShape.prototype.equal = function (t) {
        return this === t;
    };
    return CBottomShape;
}());
exports.CBottomShape = CBottomShape;
exports.BottomShape = new CBottomShape();
var CNullShape = /** @class */ (function () {
    function CNullShape() {
    }
    Object.defineProperty(CNullShape.prototype, "nullable", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CNullShape.prototype, "type", {
        get: function () {
            return 1 /* NULL */;
        },
        enumerable: true,
        configurable: true
    });
    CNullShape.prototype.makeNullable = function () {
        return this;
    };
    CNullShape.prototype.makeNonNullable = function () {
        return this;
    };
    CNullShape.prototype.emitType = function (e) {
        e.interfaces.write("null");
    };
    CNullShape.prototype.getProxyType = function (e) {
        return "null";
    };
    CNullShape.prototype.equal = function (t) {
        return this === t;
    };
    return CNullShape;
}());
exports.CNullShape = CNullShape;
exports.NullShape = new CNullShape();
var CNumberShape = /** @class */ (function () {
    function CNumberShape() {
    }
    Object.defineProperty(CNumberShape.prototype, "nullable", {
        get: function () {
            return this === exports.NullableNumberShape;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CNumberShape.prototype, "type", {
        get: function () {
            return 5 /* NUMBER */;
        },
        enumerable: true,
        configurable: true
    });
    CNumberShape.prototype.makeNullable = function () {
        return exports.NullableNumberShape;
    };
    CNumberShape.prototype.makeNonNullable = function () {
        return exports.NumberShape;
    };
    CNumberShape.prototype.emitType = function (e) {
        e.interfaces.write(this.getProxyType(e));
    };
    CNumberShape.prototype.getProxyType = function (e) {
        var rv = "number";
        if (this.nullable) {
            rv += " | null";
        }
        return rv;
    };
    CNumberShape.prototype.equal = function (t) {
        return this === t;
    };
    return CNumberShape;
}());
exports.CNumberShape = CNumberShape;
exports.NumberShape = new CNumberShape();
exports.NullableNumberShape = new CNumberShape();
var CStringShape = /** @class */ (function () {
    function CStringShape() {
    }
    Object.defineProperty(CStringShape.prototype, "type", {
        get: function () {
            return 3 /* STRING */;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CStringShape.prototype, "nullable", {
        get: function () {
            return this === exports.NullableStringShape;
        },
        enumerable: true,
        configurable: true
    });
    CStringShape.prototype.makeNullable = function () {
        return exports.NullableStringShape;
    };
    CStringShape.prototype.makeNonNullable = function () {
        return exports.StringShape;
    };
    CStringShape.prototype.emitType = function (e) {
        e.interfaces.write(this.getProxyType(e));
    };
    CStringShape.prototype.getProxyType = function (e) {
        var rv = "string";
        if (this.nullable) {
            rv += " | null";
        }
        return rv;
    };
    CStringShape.prototype.equal = function (t) {
        return this === t;
    };
    return CStringShape;
}());
exports.CStringShape = CStringShape;
exports.StringShape = new CStringShape();
exports.NullableStringShape = new CStringShape();
var CBooleanShape = /** @class */ (function () {
    function CBooleanShape() {
    }
    Object.defineProperty(CBooleanShape.prototype, "type", {
        get: function () {
            return 4 /* BOOLEAN */;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CBooleanShape.prototype, "nullable", {
        get: function () {
            return this === exports.NullableBooleanShape;
        },
        enumerable: true,
        configurable: true
    });
    CBooleanShape.prototype.makeNullable = function () {
        return exports.NullableBooleanShape;
    };
    CBooleanShape.prototype.makeNonNullable = function () {
        return exports.BooleanShape;
    };
    CBooleanShape.prototype.emitType = function (e) {
        e.interfaces.write(this.getProxyType(e));
    };
    CBooleanShape.prototype.getProxyType = function (e) {
        var rv = "boolean";
        if (this.nullable) {
            rv += " | null";
        }
        return rv;
    };
    CBooleanShape.prototype.equal = function (t) {
        return this === t;
    };
    return CBooleanShape;
}());
exports.CBooleanShape = CBooleanShape;
exports.BooleanShape = new CBooleanShape();
exports.NullableBooleanShape = new CBooleanShape();
var CAnyShape = /** @class */ (function () {
    function CAnyShape(shapes, nullable) {
        this._nullable = false;
        this._hasDistilledShapes = false;
        this._distilledShapes = [];
        this._shapes = shapes;
        this._nullable = nullable;
    }
    Object.defineProperty(CAnyShape.prototype, "type", {
        get: function () {
            return 7 /* ANY */;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CAnyShape.prototype, "nullable", {
        get: function () {
            return this._nullable === true;
        },
        enumerable: true,
        configurable: true
    });
    CAnyShape.prototype.makeNullable = function () {
        if (this._nullable) {
            return this;
        }
        else {
            return new CAnyShape(this._shapes, true);
        }
    };
    CAnyShape.prototype.makeNonNullable = function () {
        if (this._nullable) {
            return new CAnyShape(this._shapes, false);
        }
        else {
            return this;
        }
    };
    CAnyShape.prototype._ensureDistilled = function (e) {
        var _this = this;
        if (!this._hasDistilledShapes) {
            var shapes = new Map();
            for (var i = 0; i < this._shapes.length; i++) {
                var s = this._shapes[i];
                if (!shapes.has(s.type)) {
                    shapes.set(s.type, []);
                }
                shapes.get(s.type).push(s);
            }
            shapes.forEach(function (shapes, key) {
                var shape = exports.BottomShape;
                for (var i = 0; i < shapes.length; i++) {
                    shape = csh(e, shape, shapes[i]);
                }
                _this._distilledShapes.push(shape);
            });
            this._hasDistilledShapes = true;
        }
    };
    CAnyShape.prototype.getDistilledShapes = function (e) {
        this._ensureDistilled(e);
        return this._distilledShapes;
    };
    CAnyShape.prototype.addToShapes = function (shape) {
        var shapeClone = this._shapes.slice(0);
        shapeClone.push(shape);
        return new CAnyShape(shapeClone, this._nullable);
    };
    CAnyShape.prototype.emitType = function (e) {
        var _this = this;
        this._ensureDistilled(e);
        this._distilledShapes.forEach(function (s, i) {
            s.emitType(e);
            if (i < _this._distilledShapes.length - 1) {
                e.interfaces.write(" | ");
            }
        });
    };
    CAnyShape.prototype.getProxyType = function (e) {
        this._ensureDistilled(e);
        return this._distilledShapes.map(function (s) { return s.getProxyType(e); }).join(" | ");
    };
    CAnyShape.prototype.equal = function (t) {
        return this === t;
    };
    return CAnyShape;
}());
exports.CAnyShape = CAnyShape;
var CRecordShape = /** @class */ (function () {
    function CRecordShape(fields, nullable, contexts) {
        var _this = this;
        this._name = null;
        // Assign a context to all fields.
        var fieldsWithContext = new Map();
        fields.forEach(function (val, index) {
            if (val.type === 2 /* RECORD */ || val.type === 6 /* COLLECTION */) {
                fieldsWithContext.set(index, val.addContext(new FieldContext(_this, index)));
            }
            else {
                fieldsWithContext.set(index, val);
            }
        });
        this._fields = fieldsWithContext;
        this._nullable = nullable;
        this.contexts = contexts;
    }
    Object.defineProperty(CRecordShape.prototype, "type", {
        get: function () {
            return 2 /* RECORD */;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CRecordShape.prototype, "nullable", {
        get: function () {
            return this._nullable;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Construct a new record shape. Returns an existing, equivalent record shape
     * if applicable.
     */
    CRecordShape.Create = function (e, fields, nullable, contexts) {
        if (contexts === void 0) { contexts = []; }
        var record = new CRecordShape(fields, nullable, contexts);
        return e.registerRecordShape(record);
    };
    CRecordShape.prototype.makeNullable = function () {
        if (this._nullable) {
            return this;
        }
        else {
            return new CRecordShape(this._fields, true, this.contexts);
        }
    };
    CRecordShape.prototype.addContext = function (ctx) {
        this.contexts.push(ctx);
        return this;
    };
    CRecordShape.prototype.makeNonNullable = function () {
        if (this._nullable) {
            return new CRecordShape(this._fields, false, this.contexts);
        }
        else {
            return this;
        }
    };
    CRecordShape.prototype.forEachField = function (cb) {
        this._fields.forEach(cb);
    };
    CRecordShape.prototype.getField = function (name) {
        var t = this._fields.get(name);
        if (!t) {
            return exports.NullShape;
        }
        else {
            return t;
        }
    };
    CRecordShape.prototype.equal = function (t) {
        if (t.type === 2 /* RECORD */ && this._nullable === t._nullable && this._fields.size === t._fields.size) {
            var rv_1 = true;
            var tFields_1 = t._fields;
            // Check all fields.
            // NOTE: Since size is equal, no need to iterate over t. Either they have the same fields
            // or t is missing fields from this one.
            this.forEachField(function (t, name) {
                if (rv_1) {
                    var field = tFields_1.get(name);
                    if (field) {
                        rv_1 = field.equal(t);
                    }
                    else {
                        rv_1 = false;
                    }
                }
            });
            return rv_1;
        }
        return false;
    };
    CRecordShape.prototype.emitType = function (e) {
        e.interfaces.write(this.getName(e));
        if (this.nullable) {
            e.interfaces.write(" | null");
        }
    };
    CRecordShape.prototype.getProxyClass = function (e) {
        return this.getName(e) + "Proxy";
    };
    CRecordShape.prototype.getProxyType = function (e) {
        var rv = this.getName(e) + "Proxy";
        if (this.nullable) {
            rv += " | null";
        }
        return rv;
    };
    CRecordShape.prototype.emitInterfaceDefinition = function (e) {
        var w = e.interfaces;
        w.write("export interface " + this.getName(e) + " {").endl();
        this.forEachField(function (t, name) {
            w.tab(1).write(safeField(name));
            if (t.nullable) {
                w.write("?");
            }
            w.write(": ");
            t.emitType(e);
            w.write(";").endl();
        });
        w.write("}");
    };
    CRecordShape.prototype.emitProxyClass = function (e) {
        var w = e.proxies;
        w.writeln("export class " + this.getProxyClass(e) + " {");
        this.forEachField(function (t, name) {
            w.tab(1).writeln("public readonly " + safeField(name) + ": " + t.getProxyType(e) + ";");
        });
        w.tab(1).writeln("public static Parse(d: string): " + this.getProxyType(e) + " {");
        w.tab(2).writeln("return " + this.getProxyClass(e) + ".Create(JSON.parse(d));");
        w.tab(1).writeln("}");
        w.tab(1).writeln("public static Create(d: any, field: string = 'root'): " + this.getProxyType(e) + " {");
        w.tab(2).writeln("if (!field) {");
        w.tab(3).writeln("obj = d;");
        w.tab(3).writeln("field = \"root\";");
        w.tab(2).writeln("}");
        w.tab(2).writeln("if (d === null || d === undefined) {");
        w.tab(3);
        if (this.nullable) {
            w.writeln("return null;");
        }
        else {
            e.markHelperAsUsed('throwNull2NonNull');
            w.writeln("throwNull2NonNull(field, d);");
        }
        w.tab(2).writeln("} else if (typeof(d) !== 'object') {");
        e.markHelperAsUsed('throwNotObject');
        w.tab(3).writeln("throwNotObject(field, d, " + this.nullable + ");");
        w.tab(2).writeln("} else if (Array.isArray(d)) {");
        e.markHelperAsUsed('throwIsArray');
        w.tab(3).writeln("throwIsArray(field, d, " + this.nullable + ");");
        w.tab(2).writeln("}");
        // At this point, we know we have a non-null object.
        // Check all fields.
        this.forEachField(function (t, name) {
            emit_1.emitProxyTypeCheck(e, w, t, 2, "" + safeObjectField('d', name), "field + \"." + name + "\"");
        });
        w.tab(2).writeln("return new " + this.getProxyClass(e) + "(d);");
        w.tab(1).writeln("}");
        w.tab(1).writeln("private constructor(d: any) {");
        // Emit an assignment for each field.
        this.forEachField(function (t, name) {
            w.tab(2).writeln(safeObjectField('this', name) + " = " + safeObjectField('d', name) + ";");
        });
        w.tab(1).writeln("}");
        w.writeln('}');
    };
    CRecordShape.prototype.getReferencedRecordShapes = function (e, rv) {
        this.forEachField(function (t, name) {
            getReferencedRecordShapes(e, rv, t);
        });
    };
    CRecordShape.prototype.markAsRoot = function (name) {
        this._name = name;
    };
    CRecordShape.prototype.getName = function (e) {
        if (typeof (this._name) === 'string') {
            return this._name;
        }
        // Calculate unique name.
        var nameSet = new Set();
        var name = this.contexts
            .map(function (c) { return c.getName(e); })
            // Remove duplicate names.
            .filter(function (n) {
            if (!nameSet.has(n)) {
                nameSet.add(n);
                return true;
            }
            return false;
        })
            .join("Or");
        // Replace invalid Typescript charachters
        name = safeInterfaceName(name);
        this._name = e.registerName(name);
        return this._name;
    };
    return CRecordShape;
}());
exports.CRecordShape = CRecordShape;
var CCollectionShape = /** @class */ (function () {
    function CCollectionShape(baseShape, contexts) {
        if (contexts === void 0) { contexts = []; }
        this._name = null;
        // Add context if a record/collection.
        this.baseShape = (baseShape.type === 2 /* RECORD */ || baseShape.type === 6 /* COLLECTION */) ? baseShape.addContext(new EntityContext(this)) : baseShape;
        this.contexts = contexts;
    }
    Object.defineProperty(CCollectionShape.prototype, "type", {
        get: function () {
            return 6 /* COLLECTION */;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CCollectionShape.prototype, "nullable", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    CCollectionShape.prototype.makeNullable = function () {
        return this;
    };
    CCollectionShape.prototype.makeNonNullable = function () {
        return this;
    };
    CCollectionShape.prototype.addContext = function (ctx) {
        this.contexts.push(ctx);
        return this;
    };
    CCollectionShape.prototype.emitType = function (e) {
        e.interfaces.write("(");
        this.baseShape.emitType(e);
        e.interfaces.write(")[] | null");
    };
    CCollectionShape.prototype.getProxyType = function (e) {
        var base = this.baseShape.getProxyType(e);
        if (base.indexOf("|") !== -1) {
            return "(" + base + ")[] | null";
        }
        else {
            return base + "[] | null";
        }
    };
    CCollectionShape.prototype.equal = function (t) {
        return t.type === 6 /* COLLECTION */ && this.baseShape.equal(t.baseShape);
    };
    CCollectionShape.prototype.getName = function (e) {
        if (typeof (this._name) === 'string') {
            return this._name;
        }
        var nameSet = new Set();
        // No need to make collection names unique.
        this._name = this.contexts
            .map(function (c) { return c.getName(e); })
            .filter(function (name) {
            if (!nameSet.has(name)) {
                nameSet.add(name);
                return true;
            }
            return false;
        })
            .join("Or");
        return this._name;
    };
    return CCollectionShape;
}());
exports.CCollectionShape = CCollectionShape;
function csh(e, s1, s2) {
    // csh(σ, σ) = σ
    if (s1 === s2) {
        return s1;
    }
    if (s1.type === 6 /* COLLECTION */ && s2.type === 6 /* COLLECTION */) {
        // csh([σ1], [σ2]) = [csh(σ1, σ2)]
        return new CCollectionShape(csh(e, s1.baseShape, s2.baseShape));
    }
    // csh(⊥, σ) = csh(σ, ⊥) = σ
    if (s1.type === 0 /* BOTTOM */) {
        return s2;
    }
    if (s2.type === 0 /* BOTTOM */) {
        return s1;
    }
    // csh(null, σ) = csh(σ, null) = nullable<σ>
    if (s1.type === 1 /* NULL */) {
        return s2.makeNullable();
    }
    if (s2.type === 1 /* NULL */) {
        return s1.makeNullable();
    }
    // csh(any, σ) = csh(σ, any) = any
    if (s1.type === 7 /* ANY */) {
        return s1.addToShapes(s2);
    }
    if (s2.type === 7 /* ANY */) {
        return s2.addToShapes(s1);
    }
    // csh(σ2, nullable<σˆ1> ) = csh(nullable<σˆ1> , σ2) = nullable<csh(σˆ1, σ2)>
    if (s1.nullable && s1.type !== 6 /* COLLECTION */) {
        return csh(e, s1.makeNonNullable(), s2).makeNullable();
    }
    if (s2.nullable && s2.type !== 6 /* COLLECTION */) {
        return csh(e, s2.makeNonNullable(), s1).makeNullable();
    }
    // (recd) rule
    if (s1.type === 2 /* RECORD */ && s2.type === 2 /* RECORD */) {
        // Get all fields.
        var fields_1 = new Map();
        s1.forEachField(function (t, name) {
            fields_1.set(name, csh(e, t, s2.getField(name)));
        });
        s2.forEachField(function (t, name) {
            if (!fields_1.has(name)) {
                fields_1.set(name, csh(e, t, s1.getField(name)));
            }
        });
        return CRecordShape.Create(e, fields_1, false);
    }
    // (any) rule
    return new CAnyShape([s1, s2], s1.nullable || s2.nullable);
}
exports.csh = csh;
function d2s(e, d) {
    if (d === undefined || d === null) {
        return exports.NullShape;
    }
    switch (typeof (d)) {
        case 'number':
            return exports.NumberShape;
        case 'string':
            return exports.StringShape;
        case 'boolean':
            return exports.BooleanShape;
    }
    // Must be an object or array.
    if (Array.isArray(d)) {
        // Empty array: Not enough information to figure out a precise type.
        if (d.length === 0) {
            return new CCollectionShape(exports.NullShape);
        }
        var t = exports.BottomShape;
        for (var i = 0; i < d.length; i++) {
            t = csh(e, t, d2s(e, d[i]));
        }
        return new CCollectionShape(t);
    }
    var keys = Object.keys(d);
    var fields = new Map();
    for (var i = 0; i < keys.length; i++) {
        var name = keys[i];
        fields.set(name, d2s(e, d[name]));
    }
    return CRecordShape.Create(e, fields, false);
}
exports.d2s = d2s;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0eXBlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUE4RDtBQUU1RCwwQ0FBMEM7QUFDMUMsSUFBTSxZQUFZLEdBQUcsa0JBQWtCLENBQUM7QUFDMUMsbUJBQW1CLEtBQWE7SUFFOUIsT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQztRQUM5QixDQUFDLENBQUMsT0FBSSxLQUFLLE9BQUc7UUFDZCxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQ1osQ0FBQztBQUVELDJCQUEyQixJQUFZO0lBQ3JDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUMzRSxDQUFDO0FBRUQseUJBQXlCLFVBQWtCLEVBQUUsS0FBYTtJQUV4RCxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDO1FBQzlCLENBQUMsQ0FBSSxVQUFVLFdBQUssS0FBSyxRQUFJO1FBQzdCLENBQUMsQ0FBSSxVQUFVLFNBQUksS0FBTyxDQUFDO0FBQy9CLENBQUM7QUFvQkQsb0JBQW9CLENBQVM7SUFDM0IsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQTdDLENBQTZDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDekYsQ0FBQztBQUVELG1DQUEwQyxDQUFVLEVBQUUsQ0FBb0IsRUFBRSxF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