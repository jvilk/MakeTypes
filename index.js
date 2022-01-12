#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var yargs = require("yargs");
var fs = require("fs");
var path = require("path");
var index_1 = require("./lib/index");
var argv = yargs.usage('Usage: $0 [options] inputFile rootName')
    .alias('i', 'interface-file')
    .string('i')
    .describe('i', 'Specify output file for interfaces')
    .alias('p', 'proxy-file')
    .string('p')
    .describe('p', 'Specity output file for TypeScript proxy classes')
    .help('h')
    .alias('h', 'help')
    .argv;
var interfaceWriter = new index_1.NopWriter();
var proxyWriter = interfaceWriter;
if (argv.i && argv.p && path.resolve(argv.i) === path.resolve(argv.p)) {
    console.error("Interfaces and proxies cannot be written to same file.");
    yargs.showHelp();
    process.exit(1);
}
if (argv.i) {
    interfaceWriter = new index_1.StreamWriter(fs.createWriteStream(argv.i));
}
if (argv.p) {
    proxyWriter = new index_1.StreamWriter(fs.createWriteStream(argv.p));
}
if (argv._.length !== 2) {
    console.error("Please supply an input file with samples in a JSON array, and a symbol to use for the root interface / proxy.");
    yargs.showHelp();
    process.exit(1);
}
var samples = JSON.parse(fs.readFileSync(argv._[0]).toString());
var e = new index_1.Emitter(interfaceWriter, proxyWriter);
e.emit(samples, argv._[1]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSw2QkFBK0I7QUFDL0IsdUJBQXlCO0FBQ3pCLDJCQUE2QjtBQUU3QixxQ0FBNkQ7QUFFN0QsSUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQztLQUMvRCxLQUFLLENBQUMsR0FBRyxFQUFFLGdCQUFnQixDQUFDO0tBQzVCLE1BQU0sQ0FBQyxHQUFHLENBQUM7S0FDWCxRQUFRLENBQUMsR0FBRyxFQUFFLG9DQUFvQyxDQUFDO0tBQ25ELEtBQUssQ0FBQyxHQUFHLEVBQUUsWUFBWSxDQUFDO0tBQ3hCLE1BQU0sQ0FBQyxHQUFHLENBQUM7S0FDWCxRQUFRLENBQUMsR0FBRyxFQUFFLGtEQUFrRCxDQUFDO0tBQ2pFLElBQUksQ0FBQyxHQUFHLENBQUM7S0FDVCxLQUFLLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQztLQUNsQixJQUFJLENBQUM7QUFFUixJQUFJLGVBQWUsR0FBRyxJQUFJLGlCQUFTLEVBQUUsQ0FBQztBQUN0QyxJQUFJLFdBQVcsR0FBRyxlQUFlLENBQUM7QUFDbEMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7SUFDckUsT0FBTyxDQUFDLEtBQUssQ0FBQyx3REFBd0QsQ0FBQyxDQUFDO0lBQ3hFLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNqQixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQ2pCO0FBQ0QsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFO0lBQ1YsZUFBZSxHQUFHLElBQUksb0JBQVksQ0FBQyxFQUFFLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDbEU7QUFDRCxJQUFJLElBQUksQ0FBQyxDQUFDLEVBQUU7SUFDVixXQUFXLEdBQUcsSUFBSSxvQkFBWSxDQUFDLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUM5RDtBQUNELElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0lBQ3ZCLE9BQU8sQ0FBQyxLQUFLLENBQUMsK0dBQStHLENBQUMsQ0FBQztJQUMvSCxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDakIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUNqQjtBQUVELElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztBQUNsRSxJQUFNLENBQUMsR0FBRyxJQUFJLGVBQU8sQ0FBQyxlQUFlLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDcEQsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDIn0=