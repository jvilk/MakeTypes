"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("./types");
function emitProxyTypeCheck(e, w, t, tabLevel, dataVar, fieldName) {
    switch (t.type) {
        case 7 /* ANY */:
            // TODO: This is terrible.
            var distilledShapes_1 = t.getDistilledShapes(e);
            w.tab(tabLevel).writeln("// This will be refactored in the next release.");
            distilledShapes_1.forEach(function (s, i) {
                w.tab(tabLevel + i).writeln("try {");
                emitProxyTypeCheck(e, w, s, tabLevel + i + 1, dataVar, fieldName);
                w.tab(tabLevel + i).writeln("} catch (e) {");
                if (i === distilledShapes_1.length - 1) {
                    w.tab(tabLevel + i + 1).writeln("throw e;");
                }
            });
            for (var i = 0; i < distilledShapes_1.length; i++) {
                w.tab(tabLevel + (distilledShapes_1.length - i - 1)).writeln("}");
            }
            break;
        case 4 /* BOOLEAN */:
            e.markHelperAsUsed('checkBoolean');
            w.tab(tabLevel).writeln("checkBoolean(" + dataVar + ", " + t.nullable + ", " + fieldName + ");");
            break;
        case 0 /* BOTTOM */:
            throw new TypeError('Impossible: Bottom should never appear in a type.');
        case 6 /* COLLECTION */:
            e.markHelperAsUsed('checkArray');
            w.tab(tabLevel).writeln("checkArray(" + dataVar + ", " + fieldName + ");");
            w.tab(tabLevel).writeln("if (" + dataVar + ") {");
            // Now, we check each element.
            w.tab(tabLevel + 1).writeln("for (let i = 0; i < " + dataVar + ".length; i++) {");
            emitProxyTypeCheck(e, w, t.baseShape, tabLevel + 2, dataVar + "[i]", fieldName + " + \"[\" + i + \"]\"");
            w.tab(tabLevel + 1).writeln("}");
            w.tab(tabLevel).writeln("}");
            break;
        case 1 /* NULL */:
            e.markHelperAsUsed('checkNull');
            w.tab(tabLevel).writeln("checkNull(" + dataVar + ", " + fieldName + ");");
            break;
        case 5 /* NUMBER */:
            e.markHelperAsUsed('checkNumber');
            w.tab(tabLevel).writeln("checkNumber(" + dataVar + ", " + t.nullable + ", " + fieldName + ");");
            break;
        case 2 /* RECORD */:
            // Convert into a proxy.
            w.tab(tabLevel).writeln(dataVar + " = " + t.getProxyClass(e) + ".Create(" + dataVar + ", " + fieldName + ");");
            break;
        case 3 /* STRING */:
            e.markHelperAsUsed('checkString');
            w.tab(tabLevel).writeln("checkString(" + dataVar + ", " + t.nullable + ", " + fieldName + ");");
            break;
    }
    // Standardize undefined into null.
    if (t.nullable) {
        w.tab(tabLevel).writeln("if (" + dataVar + " === undefined) {");
        w.tab(tabLevel + 1).writeln(dataVar + " = null;");
        w.tab(tabLevel).writeln("}");
    }
}
exports.emitProxyTypeCheck = emitProxyTypeCheck;
var Emitter = /** @class */ (function () {
    function Emitter(interfaces, proxies) {
        this._records = [];
        this._claimedNames = new Set();
        this._helpersToEmit = new Set();
        this.interfaces = interfaces;
        this.proxies = proxies;
    }
    Emitter.prototype.markHelperAsUsed = function (n) {
        this._helpersToEmit.add(n);
    };
    Emitter.prototype.emit = function (root, rootName) {
        var rootShape = types_1.d2s(this, root);
        if (rootShape.type === 6 /* COLLECTION */) {
            rootShape = rootShape.baseShape;
        }
        this.proxies.writeln("// Stores the currently-being-typechecked object for error messages.");
        this.proxies.writeln("let obj: any = null;");
        if (rootShape.type !== 2 /* RECORD */) {
            this._claimedNames.add(rootName);
            var roots = new Set();
            types_1.getReferencedRecordShapes(this, roots, rootShape);
            var rootArray_1 = new Array();
            roots.forEach(function (root) { return rootArray_1.push(root); });
            if (rootArray_1.length === 1) {
                this._emitRootRecordShape(rootName + "Entity", rootArray_1[0]);
            }
            else {
                for (var i = 0; i < rootArray_1.length; i++) {
                    this._emitRootRecordShape(rootName + "Entity" + i, rootArray_1[i]);
                }
            }
            this.interfaces.write("export type " + rootName + " = ");
            rootShape.emitType(this);
            this.interfaces.writeln(";").endl();
            this.proxies.writeln("export class " + rootName + "Proxy {");
            this.proxies.tab(1).writeln("public static Parse(s: string): " + rootShape.getProxyType(this) + " {");
            this.proxies.tab(2).writeln("return " + rootName + "Proxy.Create(JSON.parse(s));");
            this.proxies.tab(1).writeln("}");
            this.proxies.tab(1).writeln("public static Create(s: any, fieldName?: string): " + rootShape.getProxyType(this) + " {");
            this.proxies.tab(2).writeln("if (!fieldName) {");
            this.proxies.tab(3).writeln("obj = s;");
            this.proxies.tab(3).writeln("fieldName = \"root\";");
            this.proxies.tab(2).writeln("}");
            emitProxyTypeCheck(this, this.proxies, rootShape, 2, 's', "fieldName");
            this.proxies.tab(2).writeln("return s;");
            this.proxies.tab(1).writeln("}");
            this.proxies.writeln("}").endl();
        }
        else {
            this._emitRootRecordShape(rootName, rootShape);
        }
        this._emitProxyHelpers();
    };
    Emitter.prototype._emitRootRecordShape = function (name, rootShape) {
        var _this = this;
        this._claimedNames.add(name);
        rootShape.markAsRoot(name);
        rootShape.emitInterfaceDefinition(this);
        rootShape.emitProxyClass(this);
        this.interfaces.endl();
        this.proxies.endl();
        var set = new Set();
        rootShape.getReferencedRecordShapes(this, set);
        set.forEach(function (shape) {
            shape.emitInterfaceDefinition(_this);
            shape.emitProxyClass(_this);
            _this.interfaces.endl();
            _this.proxies.endl();
        });
    };
    Emitter.prototype._emitProxyHelpers = function () {
        var w = this.proxies;
        var s = this._helpersToEmit;
        if (s.has('throwNull2NonNull')) {
            this.markHelperAsUsed("errorHelper");
            w.writeln("function throwNull2NonNull(field: string, d: any): never {");
            w.tab(1).writeln("return errorHelper(field, d, \"non-nullable object\", false);");
            w.writeln("}");
        }
        if (s.has('throwNotObject')) {
            this.markHelperAsUsed("errorHelper");
            w.writeln("function throwNotObject(field: string, d: any, nullable: boolean): never {");
            w.tab(1).writeln("return errorHelper(field, d, \"object\", nullable);");
            w.writeln("}");
        }
        if (s.has('throwIsArray')) {
            this.markHelperAsUsed("errorHelper");
            w.writeln("function throwIsArray(field: string, d: any, nullable: boolean): never {");
            w.tab(1).writeln("return errorHelper(field, d, \"object\", nullable);");
            w.writeln("}");
        }
        if (s.has('checkArray')) {
            this.markHelperAsUsed("errorHelper");
            w.writeln("function checkArray(d: any, field: string): void {");
            w.tab(1).writeln("if (!Array.isArray(d) && d !== null && d !== undefined) {");
            w.tab(2).writeln("errorHelper(field, d, \"array\", true);");
            w.tab(1).writeln("}");
            w.writeln("}");
        }
        if (s.has('checkNumber')) {
            this.markHelperAsUsed("errorHelper");
            w.writeln("function checkNumber(d: any, nullable: boolean, field: string): void {");
            w.tab(1).writeln("if (typeof(d) !== 'number' && (!nullable || (nullable && d !== null && d !== undefined))) {");
            w.tab(2).writeln("errorHelper(field, d, \"number\", nullable);");
            w.tab(1).writeln("}");
            w.writeln("}");
        }
        if (s.has('checkBoolean')) {
            this.markHelperAsUsed("errorHelper");
            w.writeln("function checkBoolean(d: any, nullable: boolean, field: string): void {");
            w.tab(1).writeln("if (typeof(d) !== 'boolean' && (!nullable || (nullable && d !== null && d !== undefined))) {");
            w.tab(2).writeln("errorHelper(field, d, \"boolean\", nullable);");
            w.tab(1).writeln("}");
            w.writeln("}");
        }
        if (s.has('checkString')) {
            this.markHelperAsUsed("errorHelper");
            w.writeln("function checkString(d: any, nullable: boolean, field: string): void {");
            w.tab(1).writeln("if (typeof(d) !== 'string' && (!nullable || (nullable && d !== null && d !== undefined))) {");
            w.tab(2).writeln("errorHelper(field, d, \"string\", nullable);");
            w.tab(1).writeln("}");
            w.writeln("}");
        }
        if (s.has('checkNull')) {
            this.markHelperAsUsed("errorHelper");
            w.writeln("function checkNull(d: any, field: string): void {");
            w.tab(1).writeln("if (d !== null && d !== undefined) {");
            w.tab(2).writeln("errorHelper(field, d, \"null or undefined\", false);");
            w.tab(1).writeln("}");
            w.writeln("}");
        }
        if (s.has('errorHelper')) {
            w.writeln("function errorHelper(field: string, d: any, type: string, nullable: boolean): never {");
            w.tab(1).writeln("if (nullable) {");
            w.tab(2).writeln("type += \", null, or undefined\";");
            w.tab(1).writeln("}");
            w.tab(1).writeln("throw new TypeError('Expected ' + type + \" at \" + field + \" but found:\\n\" + JSON.stringify(d) + \"\\n\\nFull object:\\n\" + JSON.stringify(obj));");
            w.writeln("}");
        }
    };
    /**
     * Registers the provided shape with the emitter. If an equivalent shape
     * already exists, then the emitter returns the equivalent shape.
     */
    Emitter.prototype.registerRecordShape = function (s) {
        var rv = this._records.filter(function (r) { return r.equal(s); });
        if (rv.length === 0) {
            this._records.push(s);
            return s;
        }
        else {
            return rv[0];
        }
    };
    /**
     * Registers the provided shape name with the emitter. If another
     * shape has already claimed this name, it returns a similar unique
     * name that should be used instead.
     */
    Emitter.prototype.registerName = function (name) {
        if (!this._claimedNames.has(name)) {
            this._claimedNames.add(name);
            return name;
        }
        else {
            var baseName = name;
            var i = 1;
            do {
                name = "" + baseName + i;
                i++;
            } while (this._claimedNames.has(name));
            this._claimedNames.add(name);
            return name;
        }
    };
    return Emitter;
}());
exports.default = Emitter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVtaXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxpQ0FBdUY7QUFFdkYsNEJBQW1DLENBQVUsRUFBRSxDQUFTLEVBQUUsQ0FBUSxFQUFFLFFBQWdCLEVBQUUsT0FBZSxFQUFFLFNBQWlCO0lBQ3RILFFBQU8sQ0FBQyxDQUFDLElBQUksRUFBRTtRQUNmO1lBQ0UsMEJBQTBCO1lBQzFCLElBQU0saUJBQWUsR0FBRyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEQsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsaURBQWlELENBQUMsQ0FBQztZQUMzRSxpQkFBZSxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDO2dCQUMzQixDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3JDLGtCQUFrQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQVEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDbEUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO2dCQUM3QyxJQUFJLENBQUMsS0FBSyxpQkFBZSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7b0JBQ3BDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7aUJBQzdDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7WUFDSCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsaUJBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVB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