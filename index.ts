#!/usr/bin/env node
import * as yargs from 'yargs';
import * as fs from 'fs';
import * as path from 'path';

import { StreamWriter, NopWriter, Emitter } from './lib/index';

const argv = yargs.usage('Usage: $0 [options] inputFile rootName\nFrom stdin, outputs interface by default.')
  .alias('i', 'interface-file')
  .string('i')
  .describe('i', 'Specify output file for interfaces')
  .alias('p', 'proxy-file')
  .string('p')
  .describe('p', 'Specity output file for TypeScript proxy classes')
  .help('h')
  .alias('h', 'help')
  .argv;

if (process.stdin.isTTY) {
  handleShellArguments();
}
else {
  handlePipedContent();
}

let interfaceWriter = new NopWriter();
let proxyWriter = interfaceWriter;

function handleShellArguments(){
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
}

function handlePipedContent() {
  let data = '';
  process.stdin.on('readable', function() {
    const chuck = process.stdin.read();
    if(chuck !== null){
      data += chuck;
    }
  });
  process.stdin.on('end', function() {
    if (!data) {
      console.error('No input.');
      process.exit(1);
    }
    if (argv.p !== undefined) {
      proxyWriter = new StreamWriter(process.stdout);
    } else {
      interfaceWriter = new StreamWriter(process.stdout);
    }
    const samples = JSON.parse(data);
    const e = new Emitter(interfaceWriter, proxyWriter);
    e.emit(samples, 'root')
  });
}
