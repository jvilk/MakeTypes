import * as yargs from 'yargs';
import * as fs from 'fs';
import * as path from 'path';

import StreamWriter from './lib/stream_writer';
import NopWriter from './lib/nop_writer';
import {Emitter} from './lib/types';


const argv = yargs.usage('Usage: $0 [options] rootName')
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
  process.exit(1);
}
if (argv.i) {
  interfaceWriter = new StreamWriter(fs.createWriteStream(argv.i));
}
if (argv.p) {
  proxyWriter = new StreamWriter(fs.createWriteStream(argv.p));
}
if (argv._.length === 0) {
  console.error(`Please supply a symbol to use for the root interface / proxy.`);
  process.exit(1);
}

const e = new Emitter(interfaceWriter, proxyWriter);
e.emit({
"coord": {
"lon": 14.42,
"lat": 50.09
},
"weather": [
{
"id": 802,
"main": "Clouds",
"description": "scattered clouds",
"icon": "03d"
}
],
"base": "cmc stations",
"main": {
"temp": 5,
"pressure": 1010,
"humidity": 100,
"temp_min": 5,
"temp_max": 5
},
"wind": { "speed": 1.5, "deg": 150 },
"clouds": { "all": 32 },
"dt": 1460700000,
"sys": {
"type": 1,
"id": 5889,
"message": 0.0033,
"country": "CZ",
"sunrise": 1460693287,
"sunset": 1460743037
},
"id": 3067696,
"name": "Prague",
"cod": 200
}, argv._[0]);
