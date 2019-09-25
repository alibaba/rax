# babel-plugin-transform-jsx-stylesheet
> Transform StyleSheet selector to style in JSX Elements.

## Installation

```sh
npm install --save-dev babel-plugin-transform-jsx-stylesheet
```

## Usage

### Via `.babelrc`

**.babelrc**

```json
{
  "plugins": ["transform-jsx-stylesheet"]
}
```

## Example

Your `component.js` that contains this code:

```js
import { createElement, Component } from 'rax';
import './app.css';

class App extends Component {
  render() {
    return <div className="header" />
  }
}
```

Will be transpiled into something like this:

```js
import { createElement, Component } from 'rax';
import appStyleSheet from './app.css';

class App extends Component {
  render() {
    return <div style={styleSheet.header} />;
  }
}

const styleSheet = appStyleSheet;
```

Can write multiple classNames like this:

```js
import { createElement, Component } from 'rax';
import './app.css';

class App extends Component {
  render() {
    return <div className="header1 header2" />;
  }
}
```

Will be transpiled into something like this:

```js
import { createElement, Component } from 'rax';
import appStyleSheet from './app.css';

class App extends Component {
  render() {
    return <div style={[styleSheet.header1, styleSheet.header2]} />;
  }
}

const styleSheet = appStyleSheet;
```

Also support array, object and expressions like this: **（since 0.6.0）**

```js
import { createElement, Component } from 'rax';
import './app.css';

class App extends Component {
  render() {
    return (
      <div className={'header'}>
        <div className={{ active: this.props.isActive }} />
        <div className={['header1 header2', 'header3', { active: this.props.isActive }]} />
        <div className={this.props.visible ? 'show' : 'hide'} />
        <div className={getClassName()} />
      </div>
    );
  }
}
```

Will be transpiled into something like this:

```js
import { createElement, Component } from 'rax';
import appStyleSheet from './app.css';

class App extends Component {
  render() {
    return (
      <div style={styleSheet.header}>
        <div style={_getStyle({ active: this.props.isActive })} />
        <div style={_getStyle(['header1 header2', 'header3', { active: this.props.isActive }])} />
        <div style={_getStyle(this.props.visible ? 'show' : 'hide')} />
        <div style={_getStyle(getClassName())} />
      </div>
    );
  }
}

const styleSheet = appStyleSheet;
function _getClassName() { /* codes */ }
function _getStyle(className) {
  return styleSheet[_getClassName(className)]; // not real code
}
```

And can also import multiple css file:

```js
import { createElement, Component } from 'rax';
import 'app1.css';
import 'app2.css';

class App extends Component {
  render() {
    return <div className="header1 header2" />;
  }
}
```

Will be transpiled into something like this:

```js
import { createElement, Component } from 'rax';
import app1StyleSheet from 'app1.css';
import app2StyleSheet from 'app2.css';

class App extends Component {
  render() {
    return <div style={[styleSheet.header1, styleSheet.header2]} />;
  }
}

const styleSheet = Object.assign({}, app1StyleSheet, app2StyleSheet);
```

## Theme support (since 0.7.0)

### Global Theme

#### install

```shell
npm install rax-theme-helper
```

And enable option `{ theme: true }`

#### Usage

You can write `var()` in CSS

```css
.text {
  color: var(--color-error-1);
}
```

Then change this variable at runtime

```js
import themeHelper from 'rax-theme-helper';
const origin = themeHelper.get();
themeHelper.set({
  ...origin,
  theme: {
    ...origin.theme,
    '--color-error-1': 'red'
  }
})
```

There is a default list for default theme variable: https://cdn.jsdelivr.net/npm/@rax-ui/core@1.0.0-beta.3/lib/index.d.ts

### Runtime Style Overwrite

With theme support, we can also overwrite existed style in global, for example:

```less
.LogoComponent {
  .text {
    color: bule;
  }
}
```

```js
<View>
  <Text className="other">other</Text>
  <Text className="LogoComponent_text">Logo</Text>
</View>
```

We can overwrite style for `LogoComponent_text` in global with

```js
import themeHelper from 'rax-theme-helper';
const origin = themeHelper.get();
themeHelper.set({
  ...origin,
  styles: {
    ...origin.styles,
    LogoComponent_text: {
      color: 'red',
    }
  }
})
```
