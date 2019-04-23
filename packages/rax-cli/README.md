# rax-cli [![npm](https://img.shields.io/npm/v/rax-cli.svg)](https://www.npmjs.com/package/rax-cli) [![Dependency Status](https://david-dm.org/alibaba/rax.svg?path=packages/rax-cli)](https://david-dm.org/alibaba/rax.svg?path=packages/rax-cli) [![Known Vulnerabilities](https://snyk.io/test/npm/rax-cli/badge.svg)](https://snyk.io/test/npm/rax-cli)

> Command line interface for Rax

## Install

```sh
$ npm install -g rax-cli
```

## Usage

```sh
$ rax init <ProjectName> [--verbose]
```


## Project Type Support
* WebApp Project
```
.
├── package.json
├── .gitignore
├── .eslintrc.js
├── src
│   └── index.js
└── public
    └── index.html
```
* MiniApp Project
```
.
├── manifest.json
├── package.json
├── .gitignore
├── .eslintrc.js
├── src
│   ├── app.js
│   ├── app.css
│   ├── pages
│   │   ├── page1.html
│   │   └── page2.html
│   └── components
│       ├── component1.html
│       └── component2.html
└── public
    └── index.html
```
* Mini Program Project
```
.
├── app.js
├── app.acss
├── app.json
├── package.json
├── .gitignore
├── .eslintrc.js
└── pages
    ├── page1
    │   ├── page1.acss
    │   ├── page1.axml
    │   ├── page1.js
    │   └── page1.json
    └── page2
        ├── page2.acss
        ├── page2.axml
        ├── page2.js
        └── page2.json
```

* Componen Project
```
.
├── package.json
├── .gitignore
├── ._eslintignore
├── _travis.yml
├── jest.config.js
├── public
│   ├── index.html
│   └── index.js
└── src
    ├── __tests__
    │   └── index.js
    ├── index.d.ts
    └── index.js
```

