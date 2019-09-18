/* @jsx createElement */

import createElement from '../createElement';
import Host from '../vdom/host';
import render from '../render';
import ServerDriver from 'driver-server';
import memo from '../memo';

describe('memo', () => {
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

  it('will only shallowly compare complex objects in the props object', () => {
    const container = createNodeElement('div');
    let renderCounter1 = 0;
    let renderCounter2 = 0;

    function App(props) {
      renderCounter1++;
      return <span>{props.value}</span>;
    }

    App = memo(App);

    function Outer(props) {
      renderCounter2++;
      return <App value={props.value} />;
    }

    render(<Outer value={1} />, container);
    expect(renderCounter1).toEqual(1);
    expect(renderCounter2).toEqual(1);

    render(<Outer value={2} />, container);
    expect(renderCounter1).toEqual(2);
    expect(renderCounter2).toEqual(2);

    render(<Outer value={2} />, container);
    expect(renderCounter1).toEqual(2);
    expect(renderCounter2).toEqual(3);
  });
});
