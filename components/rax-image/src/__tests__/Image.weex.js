import {createElement} from 'rax';
import renderer from 'rax-test-renderer';
import Image from '../';

jest.mock('universal-env', () => {
  return {
    isWeex: true
  };
});

describe('Link in weex', () => {
  it('should render a image', () => {
    const component = renderer.create(
      <Image source={{uri: 'a.png'}} style={{
        width: '20rem',
        height: '20rem'
      }} />
    );
    let tree = component.toJSON();
    expect(tree.tagName).toEqual('IMAGE');
    expect(tree.attributes.src).toEqual('a.png');
  });

  it('should render a image with resizeMode', () => {
    const component = renderer.create(
      <Image source={{uri: 'a.png'}} style={{
        width: '20rem',
        height: '20rem'
      }} resizeMode="cover" />
    );

    let tree = component.toJSON();
    expect(tree.style.resizeMode).toEqual('cover');
    expect(tree.attributes.resize).toEqual('cover');
  });
});
