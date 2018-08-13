import Canvas from '../index';
import renderer from 'rax-test-renderer';
import {createElement} from 'rax';

jest.mock('@weex-module/gcanvas', () => {
  return {
    enable: () => {},
    setContextType: () => {},
    resetComponent: () => {},
    render: () => {},
    extendCallNative: () => {},
    texImage2D: () => {},
    texSubImage2D: () => {},
    bindImageTexture: () => {},
    preLoadImage: () => {},
  };
}, {virtual: true});

describe('canvas', () => {
  it('render canvas', () => {
    const component = renderer.create(
      <Canvas />
    );
    let tree = component.toJSON();
    expect(tree.tagName).toEqual('CANVAS');
  });
});
