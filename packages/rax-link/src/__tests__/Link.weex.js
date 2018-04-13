import {createElement} from 'rax';
import renderer from 'rax-test-renderer';
import Link from '../';

jest.mock('universal-env', () => {
  return {
    isWeex: true
  };
});

// Could not mock universal-env in rax-text current,
// because universal-env is not peer ependencies
jest.mock('rax-text', () => {
  return function(props) {
    return <text value={props.children} />;
  };
});

describe('Link in weex', () => {
  it('should render a link', () => {
    const component = renderer.create(
      <Link>Example</Link>
    );
    let tree = component.toJSON();
    expect(tree.tagName).toEqual('A');
    expect(tree.children[0].tagName).toEqual('TEXT');
    expect(tree.children[0].attributes.value).toEqual('Example');
  });
});
