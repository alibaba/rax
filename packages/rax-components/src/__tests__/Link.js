import {createElement} from 'rax';
import renderer from 'rax-test-renderer';
import Link from '../Link';

jest.unmock('universal-env');
describe('Link', () => {
  it('should render a link', () => {
    const component = renderer.create(
      <Link>Example</Link>
    );
    let tree = component.toJSON();
    expect(tree.tagName).toEqual('A');
    expect(tree.children[0].children[0]).toEqual('Example');
  });

  it('should turn onPress to onClick', () => {
    const mockPress = jest.fn();
    const component = renderer.create(
      <Link onPress={mockPress}>Example</Link>
    );
    let tree = component.toJSON();
    expect(tree.eventListeners.click).toBe(mockPress);
  });

  it('is error in a parent link', () => {
    const component = renderer.create(
      <Link>
        <Link>Example</Link>
      </Link>
    );
    let tree = component.toJSON();
    expect(tree.children).toBe(undefined);
  });
});

