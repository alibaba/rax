#!/usr/bin/env node
if (Array.isArray(process.argv)) {
  process.argv.splice(2, 0, 'init');
}

require('rax-cli/bin/rax');
