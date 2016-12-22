#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import {StreamWriter, Emitter} from '../../lib/index';

const outdir = path.join(__dirname, "../generated");
const sampledir = path.join(__dirname, "../samples");

fs.readdirSync(sampledir)
  .filter((d) => path.extname(d).toLowerCase() === '.json')
  .forEach((d) => {
    const name = d.slice(0, d.length - 5);
    console.log(`Emitting ${name}...`);
    const interfaceWriter = new StreamWriter(fs.createWriteStream(path.join(outdir, `${name}.ts`)));
    const proxyWriter = new StreamWriter(fs.createWriteStream(path.join(outdir, `${name}Proxy.ts`)));
    const samples = JSON.parse(fs.readFileSync(path.join(sampledir, d)).toString());
    const e = new Emitter(interfaceWriter, proxyWriter);
    e.emit(samples, name);
  });
