const { join } = require('path');
const resolveDependencyComponents = require('../component-resolver');

const { resolveComponentPath } = resolveDependencyComponents;

const mockPwd = '/@mock-path@/';
const projectPath = join(mockPwd, 'test-project'); // mocked path
const pagePath = join(projectPath, 'pages/foo/foo.js');
const componentPath = join(projectPath, '/components/foo/foo');
const npmPkgPath = join(projectPath, 'node_modules/npm-pkg');
const subComponentPath = join(projectPath, 'pages/foo/sub-component/index');
const pluginComponentPath = 'plugin://foo-plugin/foo-component';

describe('component resolver', () => {
  const r = resolveComponentPath;
  it('should resolve absolute component path', () => {
    expect(
      r('/components/foo/foo', projectPath, pagePath)
    ).toEqual(componentPath);
  });

  it('should resolve relative compoennt path', () => {
    expect(
      r('../../components/foo/foo', projectPath, pagePath)
    ).toEqual(componentPath);

    expect(
      r('./sub-component/index', projectPath, pagePath)
    ).toEqual(subComponentPath);
  });

  it('should resolve npm component', () => {
    expect(
      r('npm-pkg', projectPath, pagePath)
    ).toEqual(npmPkgPath);
  });

  it('should support plugin component', () => {
    expect(
      r(pluginComponentPath, projectPath, pagePath)
    ).toEqual(pluginComponentPath);
  });

  it('should resolve config properly', () => {
    const usingComponents = {
      npm: 'npm-pkg/es/card/index',
      plugin: pluginComponentPath,
      relative: '../../components/foo/index',
      absolute: '/components/foo/index',
      self: './foo.js',
    };
    expect(
      resolveDependencyComponents({ usingComponents }, projectPath, pagePath)
    ).toMatchSnapshot();
  });
});
