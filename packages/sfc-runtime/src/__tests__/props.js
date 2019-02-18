import adapterComponent from '../adapterComponent';
import Rax from 'rax';
import testRenderer from 'rax-test-renderer'; // eslint-disable-line
import renderHelpers from 'render-helpers';

const { _c, _r } = renderHelpers;
_r(Rax);

function renderFooAsChildren() {
  return _c('view', null, this.foo);
}

describe('props', () => {
  it('should pass props to child', () => {
    const Child = adapterComponent({
      props: ['foo'],
    }, () => renderFooAsChildren, {}, Rax);
    const Container = adapterComponent({}, function() {
      return () => _c(Child, { foo: 'Hello SFC'});
    }, {}, Rax);
    const renderResult = testRenderer.create(_c(Container)).toJSON();
    expect(renderResult.children).toEqual(['Hello SFC']);
  });

  it('should change props by child', () => {
    const Child = adapterComponent({
      props: ['foo'],
      beforeMount() {
        this.foo = 'Hello MiniApp';
      },
    }, () => renderFooAsChildren, {}, Rax);
    const Container = adapterComponent({}, function() {
      return () => _c(Child, { foo: 'Hello SFC'});
    }, {}, Rax);
    const rendered = testRenderer.create(_c(Container));
    expect(rendered.toJSON().children).toEqual(['Hello MiniApp']);
  });
});
