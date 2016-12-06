# Tutorial

Rax is like React, you can use a component in the same way both in native and web as building blocks. So to understand the basic structure of a Rax app, you need to understand some of the basic React concepts, like JSX, components, state, and props. 

## Hello World

In accordance with the ancient traditions of our people, we must first build an app that does nothing but "Hello world". Here it is:

```js
import {createElement, Component, render} from 'rax';

class Hello extends Component {
  render() {
    return (
      <test>Hello World</test>
    );
  }
}

render(<Hello />);
```

## What's going on here?

First of all, ES2015 (also known as ES6) is a set of improvements to JavaScript that is now part of the official standard, but not yet supported by all browsers, so often it isn't used yet in web development. React Native ships with ES2015 support, so you can use this stuff without worrying about compatibility. `import`, `from`, `class`, `extends`, and the `() =>` syntax in the example above are all ES2015 features.

The other unusual thing in this code example is `<text>Hello world!</text>`. This is JSX - a syntax for embedding XML within JavaScript. It's a native compontent. If you want use `<span/>` on web, you can also write like this.

```
import {createElement, Component, render} from 'rax';
import {isWeex, isWeb} from 'universal-env';

class Hello extends Component {
  render() {
    if (isWeex) {
      return (
        <text>Hello world</text>
      );
    } else {
      return (
        <span>Hello world</span>
      );
    }
  }
}

render(<Hello />);
```

So, both web and native have the same appearance for you project.
