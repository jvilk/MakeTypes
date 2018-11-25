#!/usr/bin/env node
import * as yargs from 'yargs';
import * as fs from 'fs';
import * as path from 'path';

import {StreamWriter, NopWriter, Emitter} from './lib/index';

const argv = yargs.usage('Usage: $0 [options] inputFile [...] rootName')
  .alias('i', 'interface-file')
  .string('i')
  .describe('i', 'Output file for interfaces')
  .alias('p', 'proxy-file')
  .string('p')
  .describe('p', 'Output file for TypeScript proxy classes')
  .help('h')
  .alias('h', 'help')
  .argv;

let interfaceWriter = new NopWriter();
let proxyWriter = interfaceWriter;
if (!argv.i && !argv.p) {
  console.error('Please specify at least one of -i or -p to indicate desired output.');
  yargs.showHelp();
  process.exit(1);
}
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
  console.error(`Please supply an input file with samples in a JSON array, and a symbol to use for the root interface / proxy.`);
  yargs.showHelp();
  process.exit(1);
}

const samples: any[] = [];
for (const i of argv._.slice(0, -1)) {
  const thisSample = JSON.parse(fs.readFileSync(i).toString());
  if (Array.isArray(thisSample)) {
    for (let j = 0; j < thisSample.length; j++) {
      samples.push(thisSample[j]);
    }
  } else {
    samples.push(thisSample);
  }
}
const e = new Emitter(interfaceWriter, proxyWriter);
e.emit(samples, argv._[argv.length - 1]);
