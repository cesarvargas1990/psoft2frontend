/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const target = path.join(
  __dirname,
  '..',
  'node_modules',
  'webpack-dev-middleware',
  'lib',
  'util.js',
);

if (!fs.existsSync(target)) {
  console.log('patch-webpack-dev-middleware: target file not found, skipping');
  process.exit(0);
}

const source = fs.readFileSync(target, 'utf8');
const from = 'if (req.headers.range) {';
const to = 'if (req && req.headers && req.headers.range) {';

if (source.includes(to)) {
  console.log('patch-webpack-dev-middleware: patch already applied');
  process.exit(0);
}

if (!source.includes(from)) {
  console.log('patch-webpack-dev-middleware: expected pattern not found, skipping');
  process.exit(0);
}

const patched = source.replace(from, to);
fs.writeFileSync(target, patched, 'utf8');
console.log('patch-webpack-dev-middleware: patch applied');
