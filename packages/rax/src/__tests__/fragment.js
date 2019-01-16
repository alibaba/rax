/* @jsx createElement */

import createElement from '../createElement';
import Host from '../vdom/host';
import render from '../render';
import ServerDriver from 'driver-server';
import Fragment from '../fragment';

describe('Fragment', () => {
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

  it('render a fragment with one child', () => {
    const container = createNodeElement('div');
    render(
      <Fragment>
        <div>text</div>
      </Fragment>,
      container
    );
    expect(container.childNodes[0].tagName).toBe('DIV');
  });

  it('render a fragment with several children', () => {
    const container = createNodeElement('div');
    let Header = props => {
      return <p>text</p>;
    };
    let Footer = props => {
      return (
        <Fragment>
          <h2>text</h2>
          <h3>text</h3>
        </Fragment>
      );
    };

    render(
      <Fragment>
        <div>text</div>
        <span>text</span>
        <Header />
        <Footer />
      </Fragment>,
      container
    );

    expect(container.childNodes[0].tagName).toBe('DIV');
    expect(container.childNodes[1].tagName).toBe('SPAN');
    expect(container.childNodes[2].tagName).toBe('P');
    expect(container.childNodes[3].tagName).toBe('H2');
    expect(container.childNodes[4].tagName).toBe('H3');
  });

  it('render a nested fragment', () => {
    const container = createNodeElement('div');
    render(
      <Fragment>
        <Fragment>
          <div>text</div>
        </Fragment>
        <span>text</span>
        <Fragment>
          <Fragment>
            <Fragment>
              {null}
              <p />
            </Fragment>
            {false}
          </Fragment>
        </Fragment>
      </Fragment>,
      container
    );

    expect(container.childNodes[0].tagName).toBe('DIV');
    expect(container.childNodes[1].tagName).toBe('SPAN');
    expect(container.childNodes[2].nodeType).toBe(8);
    expect(container.childNodes[3].tagName).toBe('P');
    expect(container.childNodes[4].nodeType).toBe(8);
  });

  it('render an empty fragment', () => {
    const container = createNodeElement('div');
    render(<Fragment />, container);
    expect(container.childNodes[0].nodeType).toBe(8);
  });
});
