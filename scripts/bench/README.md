# Rax Benchmarking

This work is derived from [js-framework-benchmark](https://github.com/krausest/js-framework-benchmark).


```bash
# build and run all benchmarks
npm start

# only run `rax-local` , and compare data in the `results` fold (to improve bench times)
npm start -- --local

# run specific frameworks and benchmarks with prefixes like in the following example
npm start -- --framework rax preact --benchmark 01_ 02_

# skip build
npm start -- --skip-build

# build a single framework
cd frameworks/rax
npm install
npm run build-prod
```

