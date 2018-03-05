# rax-test-renderer [![npm](https://img.shields.io/npm/v/rax-test-renderer.svg)](https://www.npmjs.com/package/rax-test-renderer) [![Dependency Status](https://david-dm.org/alibaba/rax.svg?path=packages/rax-test-renderer)](https://david-dm.org/alibaba/rax.svg?path=packages/rax-test-renderer) [![Known Vulnerabilities](https://snyk.io/test/npm/rax-test-renderer/badge.svg)](https://snyk.io/test/npm/rax-test-renderer)

> Rax renderer for snapshot testing.

## Install

```sh
$ npm install --save-dev rax-test-renderer
```

## Usage

This package provides an renderer that can be used to render Rax components to pure JavaScript objects, without depending on the DOM or a native mobile environment:

```jsx
import {createElement} from 'rax';
import renderer from 'rax-test-renderer';

const tree = renderer.create(
  <Link page="https://example.com/">Example</Link>
);

console.log(tree.toJSON());
// { tagName: 'A',
//   attributes: { href: 'https://example.com/' },
//   children: [ 'Example' ] }
```

You can also use Jest's snapshot testing feature to automatically save a copy of the JSON tree to a file and check in your tests that it hasn't changed: http://facebook.github.io/jest/blog/2016/07/27/jest-14.html.

```jsx
import {createElement} from 'rax';
import renderer from 'rax-test-renderer';

test('Link renders correctly', () => {
  const tree = renderer.create(
    <Link page="https://example.com">Example</Link>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
```
