const { join } = require('path');
const { resolveComponentPath } = require('../component-resolver');

const projectPath = join(__dirname, '__files__/test-project');
const pagePath = join(projectPath, 'pages/foo/foo.js');
const componentPath = join(projectPath, '/components/foo/foo');
const subComponentPath = join(pagePath, '/sub-component/index');

describe('component resolver', () => {
  const r = resolveComponentPath;
  it('should resolve component path', () => {
    expect(
      r('/components/foo/foo', projectPath, pagePath)
    ).toEqual(componentPath);

    expect(
      r('../../components/foo/foo', projectPath, pagePath)
    ).toEqual(componentPath);

    expect(
      r('./sub-component', projectPath, pagePath)
    ).toEqual(subComponentPath);
  });

  // todo: npm add to git
  it('should resolve npm component', () => {
    expect(
      r('npm-pkg', projectPath, pagePath)
    ).toEqual(componentPath);
  });
});
