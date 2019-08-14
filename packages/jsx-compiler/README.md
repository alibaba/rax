# jsx-compiler

Transform JSX styled Rax Components into miniapp parts.

## example

input:

```jsx
import { Component } from 'rax';

export default class extends Component {

  render() {
    return (<view>hello world</view>);
  }
}
```

Run jsx compiler.

- type: Required, enum of `app`, `page`, `component`.
- outputPath: Required, string of dist path.
- sourcePath: Required, string of source path.
- resourcePath: Required, string of original file path.

```js
const compile = require('jsx-compiler');
const { baseOptions } = compile;

const output = compile(code, { ...baseOptions, type: 'component' });
```

output:

- ast
  - Babel 7 format AST of JS code
- imported
  - Imported modules and local identifiers
- exported
  - Exported identifiers
- template
  - axml template for miniapp
- code
  - Transformed JS code.
- map
  - Source map of JS code
- config
  - JS Object, miniapp config
- style
  - String, acss of style.
- usingComponents

eg.

```js
{
  ast: ASTNodeTree,
  imported: {
    rax: [
      {
        local: "Component",
        default: false,
        importFrom: "Component",
        name: "rax",
        external: true
      }
    ]
  },
  exported: ["default"],
  code:
    'import { createComponent as __create_component__, Component as __component__ } from "jsx2mp-runtime";\n\nconst __def__ = class extends __component__ {\n  render() {\n    return {};\n  }\n\n};\n\nComponent(__create_component__(__def__, {\n  events: []\n}));',
  map: null,
  config: {
    component: true
  },
  style: "",
  usingComponents: {},
  template: "<view>hello world</view>"
}
```
