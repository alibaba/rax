/* @jsx createElement */

'use strict';

import createElement from '../../createElement';
import Host from '../host';
import render from '../../render';
import ServerDriver from 'driver-server';
import { PureComponent } from '../component';

describe('EmptyComponent', function() {
  beforeEach(function() {
    Host.driver = ServerDriver;
    jest.useFakeTimers();
  });

  afterEach(function() {
    Host.driver = null;
    jest.useRealTimers();
  });

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

  it('empty nodes should not be rebuilt', function() {
    class Foo extends PureComponent {
      state = {
        alwaysShowNULL: false
      };
      render() {
        return (
          this.state.alwaysShowNULL ? null : null
        );
      }
    }
    const el = createNodeElement('div');
    let component = render(<Foo />, el);
    jest.runAllTimers();

    component.setState({alwaysShowNULL: !component.state.alwaysShowNULL});
    jest.runAllTimers();
    const emptyNode1 = el.childNodes[0];

    component.setState({alwaysShowNULL: !component.state.alwaysShowNULL});
    jest.runAllTimers();
    const emptyNode2 = el.childNodes[0];


    expect(emptyNode1).toBe(emptyNode2);
  });

  it('empty node is updated normally', function() {
    class Foo extends PureComponent {
      state = {
        alwaysShowNULL: true
      };
      render() {
        return (
          [
            <div key="foo-div"></div>,
            this.state.alwaysShowNULL ? null : <label key="hello" text="hello" />,
            <label key="world" text="world" />,
          ]
        );
      }
    }
    const el = createNodeElement('div');
    let component = render(<Foo />, el);
    jest.runAllTimers();
    expect(el.childNodes.length).toBe(3);
    const originEmptyNode = el.childNodes[1];

    component.setState({alwaysShowNULL: false});
    jest.runAllTimers();
    const emptyNode1 = el.childNodes[1];
    expect(el.childNodes.length).toBe(3);
    expect(originEmptyNode).not.toBe(emptyNode1);
  });
});
