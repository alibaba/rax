/* @jsx createElement */

import createElement from '../createElement';
import Host from '../vdom/host';
import render from '../render';
import ServerDriver from 'driver-server';
import Fragment from '../fragment';
import Component from '../vdom/component';

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

  it('should render correct from no empty array to empty', function() {
    let el = createNodeElement('div');

    function F({ type }) {
      if (type === 'empty') {
        return [];
      }
      return <div>2</div>;
    }

    function G({ type }) {
      if (type === 'empty') {
        return ['1', '2'];
      }
      return [];
    }

    class App extends Component {
      render() {
        return (
          [
            <div>1</div>,
            <G type={this.props.type} />,
            <F type={this.props.type} />,
            <div>3</div>,
          ]
        );
      }
    }

    expect(() => {
      render(<App type="empty" />, el);
      expect(el.childNodes[0].childNodes[0].data).toBe('1');
      expect(el.childNodes[1].data).toBe('1');
      expect(el.childNodes[2].data).toBe('2');
      expect(el.childNodes[3].childNodes[0].data).toBe('3');
      render(<App />, el);
      expect(el.childNodes[0].childNodes[0].data).toBe('1');
      expect(el.childNodes[1].childNodes[0].data).toBe('2');
      expect(el.childNodes[2].childNodes[0].data).toBe('3');
    }).toWarnDev('Warning: Each child in a list should have a unique "key" prop. Check the render method of <App>', {withoutStack: true});
  });

  it('should render correct when swap element position', function() {
    let el = createNodeElement('div');

    function F({ type }) {
      if (type === 'empty') {
        return [];
      }
      return <span>2</span>;
    }

    function G({ type }) {
      if (type === 'empty') {
        return ['1', '2'];
      }
      return [];
    }

    class App extends Component {
      render() {
        if (this.props.type === 'empty') {
          return [
            <F />,
            <G />,
            <div>1</div>
          ];
        }

        return (
          [
            <div>1</div>,
            <G type={this.props.type} />,
            <F type={this.props.type} />,
            <div>3</div>,
          ]
        );
      }
    }

    render([<div>0</div>, <App />, <App type={'empty'} />, <span>10</span>], el);
    expect(el.childNodes[0].childNodes[0].data).toBe('0');
    expect(el.childNodes[1].childNodes[0].data).toBe('1');
    expect(el.childNodes[2].childNodes[0].data).toBe('2');
    expect(el.childNodes[3].childNodes[0].data).toBe('3');
    expect(el.childNodes[4].childNodes[0].data).toBe('2');
    expect(el.childNodes[5].childNodes[0].data).toBe('1');

    render([<App />, <div>0</div>, <App type={'empty'} />], el);
    expect(el.childNodes[0].childNodes[0].data).toBe('1');
    expect(el.childNodes[1].childNodes[0].data).toBe('2');
    expect(el.childNodes[2].childNodes[0].data).toBe('3');
    expect(el.childNodes[3].childNodes[0].data).toBe('0');
    expect(el.childNodes[4].childNodes[0].data).toBe('2');
    expect(el.childNodes[5].childNodes[0].data).toBe('1');
    expect(el.childNodes[6]).toBe(undefined);
  });

  it('should render correct from empty array to other', function() {
    let el = createNodeElement('div');

    function F({ type }) {
      if (type === 'empty') {
        return [];
      }
      return <div>2</div>;
    }

    class App extends Component {
      render() {
        return (
          [
            <div>1</div>,
            <F type={this.props.type} />,
            <div>3</div>,
          ]
        );
      }
    }

    render(<App type="empty" />, el);
    expect(el.childNodes[0].childNodes[0].data).toBe('1');
    expect(el.childNodes[1].childNodes[0].data).toBe('3');
    render(<App />, el);
    expect(el.childNodes[0].childNodes[0].data).toBe('1');
    expect(el.childNodes[1].childNodes[0].data).toBe('2');
    expect(el.childNodes[2].childNodes[0].data).toBe('3');
  });

  it('should render correct from mixed array to another mixed array', function() {
    let el = createNodeElement('div');

    function App(props) {
      if (props.type === 'empty') {
        return [
          [<div>1</div>, <div>2</div>],
          [
            <div>3</div>,
            <div>4</div>,
            [<div>5</div>]
          ]
        ];
      }

      return [
        [<div>1</div>],
        [<div>2</div>, <div>3</div>],
        <div>4</div>,
        [[[<div>5</div>]]]
      ];
    }

    render(<App type={'empty'} />, el);
    expect(el.childNodes[0].childNodes[0].data).toBe('1');
    expect(el.childNodes[1].childNodes[0].data).toBe('2');
    expect(el.childNodes[2].childNodes[0].data).toBe('3');
    expect(el.childNodes[3].childNodes[0].data).toBe('4');
    expect(el.childNodes[4].childNodes[0].data).toBe('5');

    render(<App />, el);
    expect(el.childNodes[0].childNodes[0].data).toBe('1');
    expect(el.childNodes[1].childNodes[0].data).toBe('2');
    expect(el.childNodes[2].childNodes[0].data).toBe('3');
    expect(el.childNodes[3].childNodes[0].data).toBe('4');
    expect(el.childNodes[4].childNodes[0].data).toBe('5');
  });

  it('should render correct when first element is replaced', function() {
    let el = createNodeElement('div');

    function App(props) {
      if (props.type === 'empty') {
        return [
          [<div>111</div>],
          <div>0</div>
        ];
      }

      return [<span>2</span>, <div>0</div>];
    }

    render(<App />, el);
    expect(el.childNodes[0].childNodes[0].data).toBe('2');
    expect(el.childNodes[1].childNodes[0].data).toBe('0');

    render(<App type={'empty'} />, el);
    expect(el.childNodes[0].childNodes[0].data).toBe('111');
    expect(el.childNodes[1].childNodes[0].data).toBe('0');
  });

  it('fragment should diff correct when fist element is empty array', function() {
    let el = createNodeElement('div');

    function App(props) {
      if (props.type === 'empty') {
        return [
          [[], [], []],
          [],
          [],
          <span>0</span>,
          <span>1</span>
        ];
      } else {
        return [
          <div>2</div>,
          <span>0</span>,
          <span>1</span>
        ];
      }
    }

    render(<App type="empty" />, el);
    expect(el.childNodes[0].childNodes[0].data).toBe('0');
    expect(el.childNodes[1].childNodes[0].data).toBe('1');

    render(<App />, el);
    expect(el.childNodes[0].childNodes[0].data).toBe('2');
    expect(el.childNodes[1].childNodes[0].data).toBe('0');
    expect(el.childNodes[2].childNodes[0].data).toBe('1');
  });

  it('should render correct when embedded in fragment', function() {
    let el = createNodeElement('div');

    function App(props) {
      if (props.type === 'empty') {
        return [
          [[], [], []],
          [],
          [],
          <span>1</span>,
          <span>2</span>
        ];
      } else {
        return [
          <div>5</div>,
          <span>1</span>,
          <span>2</span>
        ];
      }
    }

    render([<span>0</span>, <App type="empty" />, <span>3</span>], el);
    expect(el.childNodes[0].childNodes[0].data).toBe('0');
    expect(el.childNodes[1].childNodes[0].data).toBe('1');
    expect(el.childNodes[2].childNodes[0].data).toBe('2');
    expect(el.childNodes[3].childNodes[0].data).toBe('3');

    render([<span>0</span>, <App />, <span>4</span>], el);
    expect(el.childNodes[0].childNodes[0].data).toBe('0');
    expect(el.childNodes[1].childNodes[0].data).toBe('5');
    expect(el.childNodes[2].childNodes[0].data).toBe('1');
    expect(el.childNodes[3].childNodes[0].data).toBe('2');
    expect(el.childNodes[4].childNodes[0].data).toBe('4');
  });

  it('from empty array to not-empty', function() {
    let el = createNodeElement('div');

    function App(props) {
      if (props.type === 'empty') {
        return [
          <span>0</span>,
          [],
          <span>3</span>,
        ];
      } else {
        return [
          <span>0</span>,
          [
            <span>1</span>,
            <span>2</span>,
          ],
          <span>3</span>
        ];
      }
    }

    render(<App type="empty" />, el);
    expect(el.childNodes[0].childNodes[0].data).toBe('0');
    expect(el.childNodes[1].childNodes[0].data).toBe('3');

    render(<App />, el);

    expect(el.childNodes[0].childNodes[0].data).toBe('0');
    expect(el.childNodes[1].childNodes[0].data).toBe('1');
    expect(el.childNodes[2].childNodes[0].data).toBe('2');
    expect(el.childNodes[3].childNodes[0].data).toBe('3');
  });

  it('previous node is unmount', function() {
    let el = createNodeElement('div');

    function App(props) {
      if (props.type === 'empty') {
        return [
          <span>0</span>,
          <span>1</span>,
          [[]],
          <span>2</span>,
        ];
      } else {
        return [
          [],
          [],
          [
            <span>1</span>,
            <span>2</span>,
          ],
          <span>3</span>
        ];
      }
    }

    render(<App type="empty" />, el);
    expect(el.childNodes[0].childNodes[0].data).toBe('0');
    expect(el.childNodes[1].childNodes[0].data).toBe('1');
    expect(el.childNodes[2].childNodes[0].data).toBe('2');

    render(<App />, el);
    expect(el.childNodes[0].childNodes[0].data).toBe('1');
    expect(el.childNodes[1].childNodes[0].data).toBe('2');
    expect(el.childNodes[2].childNodes[0].data).toBe('3');
  });

  it('should render correct from not empty array to other', function() {
    let el = createNodeElement('div');

    function F({ type }) {
      if (type === 'notEmpty') {
        return ['4'];
      }
      return <div>2</div>;
    }

    class App extends Component {
      render() {
        return (
          [
            <div>1</div>,
            <F type={this.props.type} />,
            <div>3</div>,
          ]
        );
      }
    }

    render(<App type={'notEmpty'} />, el);
    expect(el.childNodes[0].childNodes[0].data).toBe('1');
    expect(el.childNodes[1].data).toBe('4');
    expect(el.childNodes[2].childNodes[0].data).toBe('3');

    render(<App />, el);
    expect(el.childNodes[0].childNodes[0].data).toBe('1');
    expect(el.childNodes[1].childNodes[0].data).toBe('2');
    expect(el.childNodes[2].childNodes[0].data).toBe('3');
  });
});
