import Element, {
  registerElement,
  createElement,
  createElementNS,
  isElement
} from '../Element';
import Text from '../Text';
import { ELEMENT_NODE, TEXT_NODE } from '../NodeTypes';

describe('workerDOM element', () => {
  /**
   * <view id="ID" data-foo="foo" data-foo-bar="fooBar">
   *   <text></text>
   *   "text"
   * </view>
   * @type {Element}
   */
  const view = new Element(ELEMENT_NODE, 'view');
  view.setAttribute('data-foo', 'foo');
  view.setAttribute('data-foo-bar', 1);
  view.setAttribute('data-object-val', { key: 'value' });
  view.setAttribute('id', 'ID');
  view.className = 'foo bar';

  const text = new Element(ELEMENT_NODE, 'text');
  view.appendChild(text);
  const textNode = new Element(TEXT_NODE, 'text');
  view.appendChild(textNode);

  it('should get className', () => {
    expect(view.className).toBe('foo bar');
    expect(view.getAttribute('class')).toBe('foo bar');
  });

  it('should get id', () => {
    expect(view.id).toBe('ID');
    expect(view.getAttribute('id')).toBe('ID');
  });

  it('should get dataset', () => {
    expect(Object.keys(view.dataset)).toEqual(['foo', 'fooBar', 'objectVal']);
    expect(view.dataset.foo).toBe('foo');
    expect(view.dataset.fooBar).toEqual(1);
    expect(view.dataset.objectVal).toEqual({ key: 'value' });
  });

  it('should have right length of children', () => {
    expect(view.children.length).toBe(1);
  });

  it('setAttribute & getAttribute & removeAttribute', () => {
    const v = new Element(ELEMENT_NODE, 'view');
    v.setAttribute('key', 'val');
    expect(v.getAttribute('key')).toEqual('val');

    v.removeAttribute('key');
    expect(v.getAttribute('key')).toEqual(undefined);
  });

  it('children', () => {
    const parent = createElement('view');
    const child1 = createElement('view');
    const child2 = createElement('view');
    const child3 = new Text('hello');
    parent.appendChild(child1);
    parent.appendChild(child2);
    parent.appendChild(child3);

    expect(parent.children).toEqual([child1, child2]);
  });

  it('registerElement', (done) => {
    registerElement('foo', class Foo {
      constructor() {
        done();
      }
    });
    createElement('foo');
  });

  it('createElement', () => {
    const el = createElement('view');
    expect(el).toBeInstanceOf(Element);
  });

  it('createElementNS', () => {
    const el = createElementNS('namespaceURI', 'view');
    expect(el).toBeInstanceOf(Element);
  });

  it('isElement', () => {
    const el = createElement('view');
    expect(isElement(el)).toEqual(true);
  });
});
