# Link 

[![npm](https://img.shields.io/npm/v/rax-link.svg)](https://www.npmjs.com/package/rax-link)

Link is the basic link component，Same as `a` Tags. default style `textDecoration: 'none'`。  

In the browser, familiar with our a tags. The use of Link tags can not open a new `webview`, it is only in the current `webview` page jump.

## Install

```bash
$ npm install rax-link --save
```

## Import

```jsx
import Link from 'rax-link';
```

## Props

| name      | type       | default  | describe   |
| :------ | :------- | :--- | :----- |
| onPress | Function | null | click event |

Support any custom attributes

## Example

```jsx
// demo
import {createElement, Component, render} from 'rax';
import View from 'rax-view';
import Link from 'rax-link';

const styles = {
  container: {
    width: 750
  }
};

class App extends Component {
  render() {
    const url = "https://taobao.com";
    return (
      <View style={styles.container}>
        <Link href={url}>this is a link</Link>
      </View>
    );
  }
}

render(<App />);
```
