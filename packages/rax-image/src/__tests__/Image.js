import {createElement, Component} from 'rax';
import renderer from 'rax-test-renderer';
import Image from '../';

describe('Image', () => {
  it('should render null when no source or source.uri', () => {
    const component = renderer.create(
      <Image />
    );
    let tree = component.toJSON();
    expect(tree).toEqual(null);
  });

  it('should render null when image no width and height', () => {
    const component = renderer.create(
      <Image source={{uri: 'a.png'}} />
    );

    let tree = component.toJSON();
    expect(tree).toEqual(null);
  });

  it('should render a image', () => {
    const component = renderer.create(
      <Image source={{uri: 'a.png'}} style={{
        width: '20rem',
        height: '20rem'
      }} />
    );

    let tree = component.toJSON();
    expect(tree.tagName).toEqual('IMG');
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
    expect(tree.style.objectFit).toEqual('cover');
  });

  it('should render a image with children', () => {
    const component = renderer.create(
      <Image source={{uri: 'a.png'}} style={{
        width: '20rem',
        height: '20rem'
      }}>
        <span />
      </Image>
    );

    let tree = component.toJSON();
    expect(tree.tagName).toEqual('DIV');
    expect(tree.children[0].tagName).toEqual('IMG');
  });
});
