/* @jsx createElement */

/* eslint react/no-did-update-set-state: "off" */

import Component from '../../component';
import {createElement} from '../../element';
import renderToString from '../renderToString';
import PropTypes from '../../proptypes';

describe('Server renderToString', () => {
  it('renders based on state', () => {
    class Foo extends Component {
      constructor(props, context) {
        super(props, context);
        this.state = {
          tag: props.tag,
          className: props.className
        };
      }
      render() {
        let Tag = this.state.tag;
        return <Tag />;
      }
    }

    let foo = <Foo tag="foo" className="bar" />;
    let str = renderToString(foo);
    expect(str).toBe('<foo data-rendered="server"></foo>');
  });


  it('renders based on context', () => {
    class Button extends Component {
      render() {
        return (
          <button style={{background: this.context.color}}>
            {this.props.children}
          </button>
        );
      }
    }

    Button.contextTypes = {
      color: PropTypes.string
    };

    class Message extends Component {
      render() {
        return (
          <div>
            {this.props.text} <Button>Delete</Button>
          </div>
        );
      }
    }

    class MessageList extends Component {
      getChildContext() {
        return {color: 'purple'};
      }

      render() {
        const children = this.props.messages.map((message) =>
          <Message text={message} />
        );
        return <div>{children}</div>;
      }
    }

    MessageList.childContextTypes = {
      color: PropTypes.string
    };

    let messages = <MessageList messages={['foo', 'bar']} />;
    let str = renderToString(messages);
    expect(str).toBe('<div data-rendered="server"><div>foo <button style="background:purple;">Delete</button></div><div>bar <button style="background:purple;">Delete</button></div></div>');
  });

  it('renders based on ref', () => {
    class MyComponent extends Component {
      componentDidMount() {
        expect(this.refs.myInput.tagName).toEqual('INPUT');
        expect(this._input.tagName).toEqual('INPUT');
      }
      render() {
        return (
          <div>
            <input id="myInput" ref="myInput" />
            <input ref={(c) => this._input = c} />
          </div>
        );
      }
    }

    let str = renderToString(<MyComponent />);
    expect(str).toBe('<div data-rendered="server"><input id="myInput"/><input/></div>');
  });

  it('renders with lifecycle methods', () => {
    class MyComponent extends Component {

      stage = '';
      state = {};

      componentWillMount() {
        this.stage = 'componentWillMount';
        this.setState({
          test: 'test'
        });
      }
      componentDidMount() {
        let mockFn = jest.fn();
        mockFn();
        expect(mockFn).toBeCalled();

        this.stage = 'componentDidMount';
      }
      componentWillReceiveProps() {
        this.stage = 'componentWillReceiveProps';
      }
      shouldComponentUpdate() {
        let mockFn = jest.fn();
        mockFn();
        expect(mockFn).toBeCalled();

        this.stage = 'shouldComponentUpdate';

        return true;
      }
      componentWillUpdate() {
        this.stage = 'componentWillUpdate';
      }
      componentDidUpdate() {
        this.stage = 'componentDidUpdate';
        this.setState({
          test: 'test'
        });
      }
      componentWillUnmount() {
        this.stage = 'componentWillUnmount';
      }
      render() {
        return (
          <div>{this.stage}</div>
        );
      }
    }

    let str = renderToString(<MyComponent />);
    expect(str).toBe('<div data-rendered="server">componentWillMount</div>');
  });
});
