# Tutorial

Rax is like React + React Native, you can use a component in the same way both in native and web as building blocks. So to understand the basic structure of a Rax app, you need to understand some of the basic React concepts, like JSX, components, state, and props.

## Hello World

In accordance with the ancient traditions of our people, we must first build an app that does nothing but "Hello world". Here it is:

```js
import {createElement, Component, render} from 'rax';
import {Text, View} from 'rax-components';
import styles from './App.css'

class App extends Component {
  render() {
    return (
      <View style={styles.app}>
        <View style={styles.appHeader}>
          <Text style={styles.appBanner}>Welcome to Rax</Text>
        </View>
        <Text style={styles.appIntro}>
          To get started, edit src/App.js and save to reload.
        </Text>
      </View>
    );
  }
}

render(<App />);
```

Rax applications some with React are divided into components – structural elements that define the rendering of parts of your application and update themselves in response to changes in input. This code declares your top-level component `App`, and determines how to render it.

Our code begins by importing dependencies. Next, it declares the `App` component, including how it renders. Our code ends by `render` the `App` component. This last part is only necessary for the top-level component in your application and you can safely ignore it otherwise.

You might notice that the contents of the return statement are not exactly JavaScript. Declarations such as `<View>` and `<Text>` make use of JSX, a syntax for embedding XML-like structures within JavaScript. JSX tags allow you to cleanly describe your UI; we talk more about them below.

Let's examine the structure of our component. We return a `View` component, which has two children:

* `Text` renders strings in different container, it's a cross container component. The implementation of the `Text` like below code:
```js
import {createElement, Component} from 'rax';
import {isWeex, isWeb} from 'universal-env';

class Text extends Component {
  render() {
    if (isWeex) {
      return (
        <text>{props.children}</text>
      );
    } else if (isWeb) {
      return (
        <span>{props.children}</span>
      );
    }
  }
}

export default Text;
```
* `View` also is a cross container component. `View` are typically used as containers, they hold other components and can be used to provide the spacing and style your UI needs.

With a better understanding of what this code does, you can make some changes. So let's change the greeting from “Welcome” to “Hello” that nested between the opening and closing <Text> tags is the text string that gets rendered. Change this to “Hello”, assuming that `npm start` is running, you can refresh your web page to see the results.

## JSX and ES6 - What's going on?

Modern web development relies heavily on tools that parse and preprocess JavaScript. This is done for a number of reasons, such as to package multiple JavaScript files together or to implement new language features. This is exactly what the React command line interface does, translating it to implement JSX and ES6:

*   **JSX** extends JavaScript with XML-like tags, allowing you to organize your document as a nested set of components in a fashion similar to HTML. JSX makes writing React applications much easier. You can read more about it on [React's web site](https://facebook.github.io/react/docs/jsx-in-depth.html). If you absolutely want to stick to strict JavaScript in your application, it is possible to [use React without JSX](https://facebook.github.io/react/docs/react-without-jsx.html) too.
*   **ES6**, also known as ES2015, stands for ECMA Script 6, which is a set of language improvements to JavaScript. It is now a part of the official standard, but not yet supported by all browsers, so a translation step is often necessary. React Native ships with ES2015 support, so you can use it without worrying about compatibility. `import`, `from`, `class`, `extends`, and the `() =>` syntax in the example above are all ES2015 features. [This page](https://babeljs.io/docs/learn-es2015/) has a good overview of ES2015 features.
