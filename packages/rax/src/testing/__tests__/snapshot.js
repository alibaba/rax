import createElement from '../../createElement';
import Component from '../../vdom/component';
import renderer from '../renderer';

const STATUS = {
  NORMAL: 'normal',
  HOVERED: 'hovered',
};

class Link extends Component {
  constructor() {
    super();

    this._onMouseEnter = this._onMouseEnter.bind(this);
    this._onMouseLeave = this._onMouseLeave.bind(this);

    this.state = {
      class: STATUS.NORMAL,
    };
  }

  _onMouseEnter() {
    this.setState({class: STATUS.HOVERED});
  }

  _onMouseLeave() {
    this.setState({class: STATUS.NORMAL});
  }

  render() {
    return (
      <a
        className={this.state.class}
        href={this.props.page || '#'}
        onMouseEnter={this._onMouseEnter}
        onMouseLeave={this._onMouseLeave}>
        {this.props.children}
      </a>
    );
  }
}

describe('snapshot', () => {
  beforeEach(function() {
    jest.useFakeTimers();
  });

  afterEach(function() {
    jest.useRealTimers();
  });

  test('Link changes the class when hovered', () => {
    const component = renderer.create(
      <Link page="https://example.com">Example</Link>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    // manually trigger the callback
    tree.eventListeners.mouseenter();
    jest.runAllTimers();
    // re-rendering
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    // manually trigger the callback
    tree.eventListeners.mouseleave();
    jest.runAllTimers();
    // re-rendering
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

