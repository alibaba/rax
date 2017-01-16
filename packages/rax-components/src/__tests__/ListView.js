import {createElement, Component} from 'rax';
import renderer from 'rax-test-renderer';
import ListView from '../ListView';

class ListViewTest extends Component {
  componentDidMount() {
    this.refs.scrollview.scrollTo();
  }
  render() {
    return <ListView ref="scrollview" renderRow={(num) => {
      return <span>{num}</span>;
    }} dataSource={[1, 2, 3]} />;
  }
}

describe('ListView', () => {
  let component;

  beforeEach(() => {
    component = renderer.create(
      <ListViewTest />
    );
  });

  it('should render a ListView', () => {
    let tree = component.toJSON();
    expect(tree.tagName).toEqual('DIV');
    expect(tree.children[0].children.length).toEqual(3);
  });
});

