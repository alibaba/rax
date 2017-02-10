# babel-plugin-jsx-class-name

## Example

Your `component.js` that contains this code:

```js
import 'foo.css';

class App extends Component {
  render() {
    return <div className="header" />
  }
}
```

will be transpiled into something like this:

```
import class_name_styles1 from 'foo.css';

class App extends Component {
  render() {
    return <div style={class_name_styles.header} />;
  }
}
let class_name_styles = class_name_styles1;
```

## Usage

* Install `babel-plugin-jsx-class-name`.

```
npm install babel-plugin-jsx-class-name --save-dev
```

* Add `jsx-class-name` into `.babelrc`.

```json
{
  "plugins": ["jsx-class-name"]
}
```
