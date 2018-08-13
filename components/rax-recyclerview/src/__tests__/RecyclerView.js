import {createElement, Component} from 'rax';
import renderer from 'rax-test-renderer';
import RecyclerView from '../';

class RecyclerViewTest extends Component {
  renderHeader() {
    return <span>header</span>;
  }
  renderFooter() {
    return <span>footer</span>;
  }
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
      ref: 'recycleview',
      children: [].concat(this.renderHeader(), this.renderBody(), this.renderFooter())
    };
    return <RecyclerView {...props} />;
  }
}

describe('RecyclerView', () => {
  let component;

  beforeEach(() => {
    component = renderer.create(
      <RecyclerViewTest />
    );
  });

  it('should render a RecyclerView', () => {
    let tree = component.toJSON();
    expect(tree.tagName).toEqual('DIV');
    expect(tree.children[0].children[0].children[0]).toEqual('header');
    expect(tree.children[0].children[1].children[0]).toEqual('1');
    expect(tree.children[0].children[2].children[0]).toEqual('2');
    expect(tree.children[0].children[3].children[0]).toEqual('3');
    expect(tree.children[0].children[4].children[0]).toEqual('footer');
  });
});
