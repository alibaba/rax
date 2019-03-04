
/* @jsx createElement */

import cloneElement from '../';
import { createElement, Component, render, shared } from 'rax';
import createFactory from 'rax-create-factory';
import ServerDriver from 'driver-server';

const { Host } = shared;

describe('cloneElement', () => {
  function createNodeElement(tagName) {
    return {
      nodeType: 1,
      tagName: tagName.toUpperCase(),
      attributes: {},
      style: {},
      childNodes: [],
      parentNode: null
    };
  }

  beforeEach(function() {
    Host.driver = ServerDriver;
  });

  afterEach(function() {
    Host.driver = null;
  });

  class ComponentClass extends Component {
    render() {
      return <div />;
    }
  }

  it('should use the same key for a cloned element', function() {
    var instance =
      <div>
        <div />
      </div>
    ;

    var element = instance.props.children;
    var cloned = cloneElement(element);

    expect(cloned.key).toBe(element.key);
  });

  it('should clone a DOM component with new props', function() {
    const container = createNodeElement('div');
    class Grandparent {
      render() {
        return <Parent child={<div className="child" />} />;
      }
    }

    class Parent {
      render() {
        return (
          <div className="parent">
            {cloneElement(this.props.child, { className: 'xyz' })}
          </div>
        );
      }
    }

    render(<Grandparent />, container);
    expect(container.childNodes[0].childNodes[0].attributes.class).toBe('xyz');
  });

  it('should clone a composite component with new props', function() {
    const container = createNodeElement('div');

    class Child {
      render() {
        return <div className={this.props.className} />;
      }
    }

    class Grandparent {
      render() {
        return <Parent child={<Child className="child" />} />;
      }
    }

    class Parent {
      render() {
        return (
          <div className="parent">
            {cloneElement(this.props.child, { className: 'xyz' })}
          </div>
        );
      }
    }

    render(<Grandparent />, container);
    expect(container.childNodes[0].childNodes[0].attributes.class).toBe('xyz');
  });

  it('should keep the original ref if it is not overridden', function() {
    class Grandparent {
      render() {
        return <Parent child={<div ref="yolo" />} />;
      }
    }

    class Parent {
      render() {
        return (
          <div>
            {cloneElement(this.props.child, { className: 'xyz' })}
          </div>
        );
      }
    }

    var component = render(<Grandparent />);
    expect(component.refs.yolo.tagName).toBe('DIV');
  });

  it('should transfer the key property', function() {
    class MyComponent {
      render() {
        return null;
      }
    }
    var clone = cloneElement(<MyComponent />, {key: 'xyz'});
    expect(clone.key).toBe('xyz');
  });

  it('should transfer children', function() {
    class MyComponent {
      render() {
        expect(this.props.children).toBe('xyz');
        return <div />;
      }
    }

    render(
      cloneElement(<MyComponent />, {children: 'xyz'})
    );
  });

  it('should shallow clone children', function() {
    class MyComponent {
      render() {
        expect(this.props.children).toBe('xyz');
        return <div />;
      }
    }

    render(
      cloneElement(<MyComponent>xyz</MyComponent>, {})
    );
  });

  it('should accept children as rest arguments', function() {
    class MyComponent {
      render() {
        return null;
      }
    }

    var clone = cloneElement(
      <MyComponent>xyz</MyComponent>,
      { children: <MyComponent /> },
      <div />,
      <span />
    );

    expect(clone.props.children).toEqual([
      <div />,
      <span />,
    ]);
  });

  it('should override children if undefined is provided as an argument', function() {
    var element = createElement(ComponentClass, {
      children: 'text',
    }, undefined);
    expect(element.props.children).toBe(undefined);

    var element2 = cloneElement(createElement(ComponentClass, {
      children: 'text',
    }), {}, undefined);
    expect(element2.props.children).toBe(undefined);
  });


  it('should support keys and refs', function() {
    class Parent {
      render() {
        var clone = cloneElement(this.props.children, {key: 'xyz', ref: 'xyz'});
        expect(clone.key).toBe('xyz');
        expect(clone.ref).toBe('xyz');
        return <div>{clone}</div>;
      }
    }

    class Grandparent {
      render() {
        return <Parent ref="parent"><span key="abc" /></Parent>;
      }
    }

    var component = render(<Grandparent />);
    expect(component.refs.parent.refs.xyz.tagName).toBe('SPAN');
  });

  it('should steal the ref if a new ref is specified', function() {
    class Parent {
      render() {
        var clone = cloneElement(this.props.children, {ref: 'xyz'});
        return <div>{clone}</div>;
      }
    }

    class Grandparent {
      render() {
        return <Parent ref="parent"><span ref="child" /></Parent>;
      }
    }

    var component = render(<Grandparent />);
    expect(component.refs.child).toBeUndefined();
    expect(component.refs.parent.refs.xyz.tagName).toBe('SPAN');
  });


  it('should overwrite props', function() {
    class MyComponent {
      render() {
        expect(this.props.myprop).toBe('xyz');
        return <div />;
      }
    }

    render(
      cloneElement(<MyComponent myprop="abc" />, {myprop: 'xyz'})
    );
  });


  it('should normalize props with default values', function() {
    class MyComponent {
      static defaultProps = {prop: 'testKey'};
      render() {
        return <span />;
      }
    }

    var instance = createElement(MyComponent);
    var clonedInstance = cloneElement(instance, {prop: undefined});
    expect(clonedInstance.props.prop).toBe('testKey');
    var clonedInstance2 = cloneElement(instance, {prop: null});
    expect(clonedInstance2.props.prop).toBe(null);

    var instance2 = createElement(MyComponent, {prop: 'newTestKey'});
    var cloneInstance3 = cloneElement(instance2, {prop: undefined});
    expect(cloneInstance3.props.prop).toBe('testKey');
    var cloneInstance4 = cloneElement(instance2, {});
    expect(cloneInstance4.props.prop).toBe('newTestKey');
  });

  it('should ignore key and ref warning getters', function() {
    var elementA = createElement('div');
    var elementB = cloneElement(elementA, elementA.props);
    expect(elementB.key).toBe(null);
    expect(elementB.ref).toBe(null);
  });

  it('should ignore undefined key and ref', function() {
    var element = createFactory(ComponentClass)({
      key: '12',
      ref: '34',
      foo: '56',
    });
    var props = {
      key: undefined,
      ref: undefined,
      foo: 'ef',
    };
    var clone = cloneElement(element, props);
    expect(clone.type).toBe(ComponentClass);
    expect(clone.key).toBe('12');
    expect(clone.ref).toBe('34');
    expect(clone.props).toEqual({foo: 'ef'});
  });

  it('should extract null key and ref', function() {
    var element = createFactory(ComponentClass)({
      key: '12',
      ref: '34',
      foo: '56',
    });
    var props = {
      key: null,
      ref: null,
      foo: 'ef',
    };
    var clone = cloneElement(element, props);
    expect(clone.type).toBe(ComponentClass);
    expect(clone.key).toBe('null');
    expect(clone.ref).toBe(null);
    expect(clone.props).toEqual({foo: 'ef'});
  });
});