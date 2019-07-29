const getDefaultExportedPath = require('../getDefaultExportedPath');
const { parseCode } = require('../../parser');

describe('getDefaultExportedPath', () => {
  it('#1', () => {
    const code = `
      import { createElement, Component } from 'rax';
      import View from 'rax-view';
      import './index.css';
      
      class Foo extends Component {
        render() {
          return (
            <View className="header">
              {this.props.children}
            </View>
          );
        }
      }
      
      export default Foo;
    `;

    const defaultExportedPath = getDefaultExportedPath(parseCode(code));
    expect(defaultExportedPath.node.type).toEqual('ClassDeclaration');
  });

  it('#2', () => {
    const code = `
      import { createElement, Component } from 'rax';
      import View from 'rax-view';
      import './index.css';
      
      function Foo() {}
      
      export default Foo;
    `;

    const defaultExportedPath = getDefaultExportedPath(parseCode(code));
    expect(defaultExportedPath.node.type).toEqual('FunctionDeclaration');
  });

  it('#3', () => {
    const code = `
      import { createElement, Component } from 'rax';
      import View from 'rax-view';
      import './index.css';
      
      export default class {};
    `;

    const defaultExportedPath = getDefaultExportedPath(parseCode(code));
    expect(defaultExportedPath.node.type).toEqual('ClassDeclaration');
  });

  it('#4', () => {
    const code = `
      import { createElement, Component } from 'rax';
      import View from 'rax-view';
      import './index.css';
      
      export default function() {}
    `;

    const defaultExportedPath = getDefaultExportedPath(parseCode(code));
    expect(defaultExportedPath.node.type).toEqual('FunctionDeclaration');
  });

  it('#5', () => {
    const code = `
      import { createElement, Component } from 'rax';
      import View from 'rax-view';
      import './index.css';
      
      class Foo extends Component {}
      
      export default Foo;
    `;

    const defaultExportedPath = getDefaultExportedPath(parseCode(code));
    expect(defaultExportedPath.node.type).toEqual('ClassDeclaration');
  });
});
