import Rax, { createElement } from 'rax';
import renderer from 'rax-test-renderer';
import createComponent from '../createComponent';
import { getComponent } from '../componentsHub';
import createWorkerDriver from 'driver-worker';

describe('Mini Program Component', () => {
  it('should render default slots', () => {
    function renderFactory(Rax) {
      return function(instance, data) {
        return (
          <view>Hello {this.$slots.default}</view>
        );
      };
    }
    const Comp = createComponent(renderFactory, Rax, {});
    const tree = renderer.create(
      <Comp page="https://example.com/">Example</Comp>
    );
    expect(tree).toMatchSnapshot();
  });

  it('should render data and props', () => {
    function renderFactory(Rax) {
      return function(data) {
        return createElement('view', {
          foo: data.foo,
          bar: data.bar,
        });
      };
    }
    const Comp = createComponent(renderFactory, Rax, {
      data: { foo: 'from data' },
    });
    const tree = renderer.create(createElement(Comp, { bar: 'from prop' }));
    expect(tree).toMatchSnapshot();
  });

  it('should works well with didMount lifecycle', () => {
    function renderFactory(Rax) {
      return function(data) {
        return createElement('view', {
          foo: data.foo,
        });
      };
    }
    const Comp = createComponent(renderFactory, Rax, {
      data: { foo: 'from data' },
      didMount() {
        this.setData({ foo: 'modified in didMount' });
      },
    });
    const tree = renderer.create(createElement(Comp));
    expect(tree).toMatchSnapshot();
  });

  it('should works well with didUpdate and didUnmount lifecycle', (done) => {
    function renderFactory(Rax) {
      return function(data) {
        return createElement('view', {
          foo: data.foo,
        });
      };
    }
    const Comp = createComponent(renderFactory, Rax, {
      data: { foo: 'from data' },
      didMount() {
        this.setData({ foo: 'modified in didMount' });
      },
      didUpdate(prevProps, prevData) {
        expect(prevProps).toEqual({ bar: 1 });
        expect(prevData).toEqual({ foo: 'from data' });
      },
      didUnmount() {
        // if did unmount not triggered, task will not be done.
        done();
      },
    });
    const tree = renderer.create(createElement(Comp, { bar: 1 }));
    tree.unmount();
  });

  it('should works well with setData', (done) => {
    function renderFactory(Rax) {
      return function(data) {
        return createElement('view', {
          foo: data.foo,
        });
      };
    }
    const Comp = createComponent(renderFactory, Rax, {
      data: { arr: [{ a: 1, b: 2 }] },
      didMount() {
        this.setData({
          'arr[0].a': 3,
          'arr[2]': { a: 10, b: 20 }
        });
        expect(this.data).toEqual({
          arr: [
            { a: 3, b: 2 },
            undefined,
            { a: 10, b: 20 },
          ]
        });
      },
      didUnmount() {
        done();
      },
    });
    const tree = renderer.create(createElement(Comp, { bar: 1 }));
    tree.unmount();
  });

  it('should works well with named slot', () => {
    function renderFactory(Rax) {
      return function(data) {
        return createElement('view', {}, [data.$slots.default, data.$slots.named]);
      };
    }
    const Comp = createComponent(renderFactory, Rax, { data: {} });
    const tree = renderer.create(createElement(Comp, {}, [
      'child',
      createElement('text', { slot: 'named' }, 'named slot')
    ]));

    expect(tree).toMatchSnapshot();
  });

  it('should works well with methods', (done) => {
    function renderFactory(Rax) {
      return function(data) {
        return createElement('view', {}, data.count);
      };
    }
    const Comp = createComponent(renderFactory, Rax, {
      data: { count: 0 },
      methods: {
        countAdd() {
          this.setData({ count: this.data.count + 1 });
        },
      },
      didMount() {
        this.countAdd();
      },
      didUnmount() {
        done();
      },
    });
    const tree = renderer.create(createElement(Comp, {}));
    expect(tree.toJSON()).toMatchSnapshot();
    tree.unmount();
  });

  it('should works well with register components', () => {
    const componentPath = 'path/to/component';
    function renderFactory(Rax) {
      return function(data) {
        return createElement('view', { foo: 'bar' });
      };
    }

    const Comp = createComponent(renderFactory, Rax, {}, componentPath);
    expect(getComponent(componentPath)).toEqual(Comp);
  });

  it('should get componet is, $page, $id', (done) => {
    const $page = Symbol('$page');

    function renderFactory(Rax) {
      return function(data) {
        return createElement('view', {}, data.count);
      };
    }
    const compPath = 'path/to/component';
    const Comp = createComponent(renderFactory, Rax, {
      data: { count: 0 },
      didMount() {
        expect(this.is).toEqual(compPath);
        expect(typeof this.$id).toEqual('number');
        expect(this.$page).toEqual($page);
        done();
      },
    }, compPath);

    class Page extends Rax.Component {
      static contextTypes = { $page: null };

      getChildContext() {
        return { $page };
      }

      render() {
        return createElement('view', {}, [createElement(Comp)]);
      }
    }

    renderer.create(createElement(Page));
  });

  it('should have default val for data', (done) => {
    function renderFactory(Rax) {
      return function(data) {
        return createElement('view', {
          foo: data.foo,
        });
      };
    }
    const Comp = createComponent(renderFactory, Rax, {
      // data field is empty.
      didMount() {
        this.someMethod();
        done();
      },
      methods: {
        someMethod() {
          expect(this.data).toEqual({});
        },
      }
    });

    renderer.create(createElement(Comp, { bar: 'from prop' }));
  });

  it('should render style once', (done) => {
    function renderFactory(Rax) {
      return function(data) {
        return createElement('view', {
          className: 'foo',
        });
      };
    }
    const cssText = '.foo { color: red; }';
    const Comp = createComponent(renderFactory, Rax, {}, 'path/to/component', cssText);

    global.setImmediate = null;
    const driver = createWorkerDriver({
      postMessage(message) {
        expect(message).toMatchSnapshot();
        done();
      },
      addEventListener() {},
    });

    class Page extends Rax.Component {
      static contextTypes = { $page: null };

      getChildContext() {
        const $page = {
          vnode: { _document: driver.document }
        };
        return { $page };
      }

      render() {
        // Render Comp 4 times.
        return createElement('view', null, [
          createElement(Comp),
          createElement(Comp),
          createElement(Comp),
          createElement(Comp),
        ]);
      }
    }

    Rax.render(createElement(Page), null, { driver });
  });

  it('should render weixin component props', () => {
    function renderFactory(Rax) {
      return function(data) {
        return createElement('view', {
          bar: data.bar,
        });
      };
    }
    const Comp = createComponent(renderFactory, Rax, {
      properties: {
        bar: {
          type: String,
          value: 'from prop'
        }
      },
    }, null, null, 'weixin');
    const tree = renderer.create(createElement(Comp));
    expect(tree).toMatchSnapshot();
  });
});

