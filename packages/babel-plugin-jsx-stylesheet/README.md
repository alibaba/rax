# babel-plugin-jsx-stylesheet

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
import appStyles from './app.css';

class App extends Component {
  render() {
    return <div style={cssStyles.header} />;
  }
}
let cssStyles = appStyles;
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
import appStyles from './app.css';

class App extends Component {
  render() {
    return <div style={[cssStyles.header1, cssStyles.header2]} />;
  }
}
let cssStyles = appStyles;
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
import app1ClassNameStyles from 'app1.css';
import app2ClassNameStyles from 'app2.css';

class App extends Component {
  render() {
    return <div style={[cssStyles.header1, cssStyles.header2]} />;
  }
}
let cssStyles = Object.assign(app1ClassNameStyles, app2ClassNameStyles);
```

## Installation

```sh
npm install --save-dev babel-plugin-jsx-stylesheet
```

## Usage

### Via `.babelrc`

**.babelrc**

```json
{
  "plugins": ["jsx-stylesheet"]
}
```
