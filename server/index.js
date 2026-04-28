#!/usr/bin/env node

process.env.ENV='PROD'
process.argv=[
  ...process.argv.slice(0, 2),
  '-d',
  '-rindex.s',
  '--workdir',
  __dirname,
]
require('sptc/bin/sptcd')
require('open').default('http://127.0.0.1:9090')
