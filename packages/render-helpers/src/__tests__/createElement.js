import * as Rax from 'rax';
import renderer from 'rax-test-renderer';
import setRender from '../setRender';
import createElement from '../createElement';

setRender(Rax);
function render(el) {
  return renderer.create(el).toJSON();
}

describe('createElement', () => {
  it('can receive two args', () => {
    const el = createElement(
      'view',
      ['hello world']
    );
    expect(render(el)).toMatchSnapshot();
  });

  it('can receive three args', () => {
    const arr = [0, 1, 2];
    const el = createElement(
      'view',
      { color: 'red', arr },
      ['hello world']
    );

    // Test case for wrongly shallow copy array props, bug #872
    expect(el.props.arr).toEqual(arr);
    expect(render(el)).toMatchSnapshot();
  });

  it('can pass ES Module output object', () => {
    const el = createElement(
      { __esModule: true, default: 'view' },
      ['hello world']
    );
    expect(render(el)).toMatchSnapshot();
  });

  it('generate empty element while template is invalid', () => {
    const el = createElement(
      '$template',
      ['hello world']
    );
    expect(el).toBeNull();
  });

  it('supports template for MiniApp', () => {
    const pageInstance = Symbol('pageInstance');
    const data = Symbol('data');
    const el = createElement(
      '$template',
      {
        is(_data) {
          expect(this).toEqual(pageInstance);
          expect(_data).toEqual(data);
          return createElement('view');
        },
        pageInstance,
        data,
      }
    );
    expect(render(el)).toMatchSnapshot();
  });
});
