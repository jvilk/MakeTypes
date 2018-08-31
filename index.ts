#!/usr/bin/env node
import * as yargs from 'yargs';
import * as fs from 'fs';
import * as path from 'path';

import {StreamWriter, NopWriter, Emitter} from './lib/index';

const argv = yargs.usage('Usage: $0 [options] inputFile [...] rootName')
  .alias('i', 'interface-file')
  .string('i')
  .describe('i', 'Specify output file for interfaces')
  .alias('p', 'proxy-file')
  .string('p')
  .describe('p', 'Specity output file for TypeScript proxy classes')
  .help('h')
  .alias('h', 'help')
  .argv;

let interfaceWriter = new NopWriter();
let proxyWriter = interfaceWriter;
if (argv.i && argv.p && path.resolve(argv.i) === path.resolve(argv.p)) {
  console.error(`Interfaces and proxies cannot be written to same file.`);
  yargs.showHelp();
  process.exit(1);
}
if (argv.i) {
  interfaceWriter = new StreamWriter(fs.createWriteStream(argv.i));
}
if (argv.p) {
  proxyWriter = new StreamWriter(fs.createWriteStream(argv.p));
}

if (argv._.length < 2) {
  console.error(`Please supply one input file with samples in a JSON array or multiple files, and a symbol to use for the root interface / proxy.`);
  yargs.showHelp();
  process.exit(1);
}

const samplesArray = new Array<any>();

for (const samplePath of argv._.slice(0, -1)) {
  samplesArray.push(JSON.parse(fs.readFileSync(samplePath).toString()));
}

const samples = samplesArray.length === 1 ? samplesArray[0] : samplesArray;
const rootName = argv._.slice(-1)[0];

const e = new Emitter(interfaceWriter, proxyWriter);
e.emit(samples, rootName);
