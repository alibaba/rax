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

class ScrollViewChildTest extends Component {
  render() {
    let props = {
      children: [<span>1</span>, null, <span>3</span>]
    };
    return <ScrollView {...props} />;
  }
}

describe('ScrollView', () => {
  let component1, component2;

  beforeEach(() => {
    component1 = renderer.create(
      <ScrollViewTest />
    );
    component2 = renderer.create(
      <ScrollViewChildTest />
    );
  });

  it('should render a ScrollView', () => {
    let tree = component1.toJSON();
    expect(tree.tagName).toEqual('DIV');
    expect(tree.children[0].children[0].children[0]).toEqual('1');
    expect(tree.children[0].children[1].children[0]).toEqual('2');
    expect(tree.children[0].children[2].children[0]).toEqual('3');
  });

  it('child in ScrollView', () => {
    let tree = component2.toJSON();
    expect(tree.tagName).toEqual('DIV');
    expect(tree.children[0].children.length).toEqual(2);
    expect(tree.children[0].children[0].children[0]).toEqual('1');
    expect(tree.children[0].children[1].children[0]).toEqual('3');
  });
});
