<p align="center">
  <a href="https://alibaba.github.io/rax">
    <img alt="Rax" src="https://user-images.githubusercontent.com/677114/59907138-e99f7180-943c-11e9-8769-07021d9fe1ca.png" width="66">
  </a>
</p>

<p align="center">
The fastest way to build universal application.
</p>

<p align="center">
  <a href="https://github.com/alibaba/rax/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/rax.svg"></a>
  <a href="https://www.npmjs.com/package/rax"><img src="https://img.shields.io/npm/v/rax.svg"></a>
  <a href="https://www.npmjs.com/package/rax"><img src="https://img.shields.io/npm/dm/rax.svg"></a>
  <a href="https://travis-ci.org/alibaba/rax"><img src="https://travis-ci.org/alibaba/rax.svg?branch=master"></a>
  <a href="https://unpkg.com/rax/dist/rax.min.js"><img src="https://img.badgesize.io/https://unpkg.com/rax/dist/rax.min.js?compression=gzip&?maxAge=3600" alt="gzip size"></a>
</p>

---

:christmas_tree: **Familiar:** React compatible API with Class Component and Hooks.

:candy: **Tiny:** ~6.4 KB minified + gzipped.

:earth_asia: **Universal:** works with DOM, Weex, Node.js, Mini-program, WebGL and could work more container that implements [driver specification](./docs/en-US/driver-spec.md).

:banana: **Easy:** using via `rax-cli` with zero configuration, one codebase with universal UI toolkit & APIs.

:lollipop: **Friendly:** developer tools for Rax development.


## Quick Start

Create a new Rax project using `create-rax`:

```sh
$ npm init rax <YourProjectName>
```
_`npm init <initializer>` is available in npm 6+_

Start local server to launch project:

```sh
$ cd <YourProjectName>
$ npm install
$ npm run start
```

### Developer Tools

You can inspect and modify the state of your Rax components at runtime using the
[Rax Developer Tools](https://github.com/raxjs/rax-devtools) browser extension,
and extension not works in `producation` mode.

1. Install the Chrome [Rax Developer Tools](https://chrome.google.com/webstore/detail/rax-developer-tools/anpeoinhjjligmgoiepbnigjhmijblff) extension
2. Reload and go to the 'Rax' tab in the browser's development tools

### VS Code Extensions

You can also use the [Rax VS Code Extensions](https://github.com/raxjs/rax-vscode-extensions) to get better development experience.

## Contributing

Want to file a bug, contribute some code, or improve documentation? Excellent! Read up on our [guidelines for contributing](./.github/CONTRIBUTING.md).

### Code Contributors

This project exists thanks to all the people who contribute.
<a href="https://github.com/alibaba/rax/graphs/contributors"><img src="https://opencollective.com/rax/contributors.svg?width=890&button=false" /></a>
