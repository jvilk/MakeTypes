#!/usr/bin/env node
import * as yargs from 'yargs';
import * as fs from 'fs';
import * as path from 'path';

import StreamWriter from './lib/stream_writer';
import NopWriter from './lib/nop_writer';
import {Emitter} from './lib/types';


const argv = yargs.usage('Usage: $0 [options] inputFile rootName')
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
if (argv._.length !== 2) {
  console.error(`Please supply an input file with samples in a JSON array, and a symbol to use for the root interface / proxy.`);
  yargs.showHelp();
  process.exit(1);
}

const samples = JSON.parse(fs.readFileSync(argv._[0]).toString());
const e = new Emitter(interfaceWriter, proxyWriter);
e.emit(samples, argv._[1]);
