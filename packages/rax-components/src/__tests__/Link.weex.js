import {createElement} from 'rax';
import renderer from 'rax-test-renderer';
import Link from '../Link';

jest.mock('universal-env');
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

