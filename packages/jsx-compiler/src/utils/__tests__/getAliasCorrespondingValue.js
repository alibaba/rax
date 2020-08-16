const isFunctionComponent = require('../isFunctionComponent');
const { parseCode, getImported } = require('../../parser');

describe('use alias to replace', () => {
  it('should replace imported module with alias', () => {
    const code = 'import { createElement } from \'react\';';

    const imported = getImported(parseCode(code), {'react': 'rax'});
    expect(imported.rax).toBeDefined();
  });
  it('should replace imported simple path with alias', () => {
    const code = 'import Comp from \'@Comp\';';

    const imported = getImported(parseCode(code), { '@Comp': '/Users/Code/src/components/comp.jsx' }, '/Users/Code/src/pages/Home/index.jsx');
    expect(imported['../../components/comp.jsx']).toBeDefined();
  });
  it('should replace imported complex path with alias', () => {
    const code = 'import Logo from \'@Comp/Logo\';';

    const imported = getImported(parseCode(code), { '@Comp': '/Users/Code/src/components' }, '/Users/Code/src/pages/Home/index.jsx');
    expect(imported['../../components/Logo']).toBeDefined();
  });
  it('should not replace imported module which starts with alias', () => {
    const code = 'import is from \'react-is\';';

    const imported = getImported(parseCode(code), { 'react': 'rax' });
    expect(imported['react-is']).toBeDefined();
  });
});
