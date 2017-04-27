import {createElement, Component} from 'rax';
import renderer from 'rax-test-renderer';
import ScrollView from '../';

class ScrollViewTest extends Component {
  renderBody() {
    return [1, 2, 3].map((num) => {
      return <span>{num}</span>;
    });
  }
  componentDidMount() {
    this.refs.recycleview.scrollTo({
      x: 0,
      y: 0
    });
  }
  render() {
    let props = {
      ref: 'scrollview',
      children: [].concat(this.renderBody())
    };
    return <ScrollView {...props} />;
  }
}

describe('ScrollView', () => {
  let component;

  beforeEach(() => {
    component = renderer.create(
      <ScrollViewTest />
    );
  });

  it('should render a ScrollView', () => {
    let tree = component.toJSON();
    expect(tree.tagName).toEqual('DIV');
    expect(tree.children[0].children[0].children[0]).toEqual('1');
    expect(tree.children[0].children[1].children[0]).toEqual('2');
    expect(tree.children[0].children[2].children[0]).toEqual('3');
  });
});
