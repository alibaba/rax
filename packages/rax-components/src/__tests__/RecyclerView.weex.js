import {createElement, Component} from 'rax';
import renderer from 'rax-test-renderer';
import RecyclerView from '../RecyclerView';

jest.mock('universal-env');

class RecyclerViewTest extends Component {
  renderHeader() {
    return <span>header</span>;
  }
  renderFooter() {
    return <span>footer</span>;
  }
  renderBody() {
    return [1, 2, 3].map((num) => {
      return <span>{num}</span>
    });
  }
  render() {
    return <RecyclerView ref="recycleview" children={[].concat(this.renderHeader(), this.renderBody(), this.renderFooter())}/>;
  }
}

describe('RecyclerView in weex', () => {
  let component;

  beforeEach(() => {
    component = renderer.create(
      <RecyclerViewTest/>
    );
  });

  it('should render a RecyclerView', () => {
    let tree = component.toJSON();
    expect(tree.tagName).toEqual('LIST');
    expect(tree.children[0].children[0]).toEqual('header');
    expect(tree.children[1].children[0]).toEqual('1');
    expect(tree.children[2].children[0]).toEqual('2');
    expect(tree.children[3].children[0]).toEqual('3');
    expect(tree.children[4].children[0]).toEqual('footer');
  });

  it('should render null when child is null', () => {
    let component = renderer.create(
      <RecyclerView children={[].concat(null, null, <span>footer</span>)}/>
    );
    let tree = component.toJSON();
    expect(tree.children.length).toEqual(1);
  });

  it('should pass a object to children', () => {
    let component = renderer.create(
      <RecyclerView children={<span>header</span>}/>
    );
    let tree = component.toJSON();
    expect(tree.children.length).toEqual(1);
  });

  it('should render real cell', () => {
    let component = renderer.create(
      <RecyclerView _autoWrapCell={true} children={<span>header</span>}/>
    );
    let tree = component.toJSON();
    expect(tree.children[0].tagName).toEqual('CELL');
  });

  it('should use RecyclerView.Header replace view', () => {
    let component = renderer.create(
      <RecyclerView _autoWrapCell={true} children={<RecyclerView.Header>header</RecyclerView.Header>}/>
    );
    let tree = component.toJSON();
    expect(tree.children[0].children[0].tagName).toEqual('HEADER');
  });

  it('should use div replace cell when not in RecyclerView', () => {
    let component = renderer.create(
      <RecyclerView.Cell/>
    );
    let tree = component.toJSON();
    expect(tree.tagName).toEqual('DIV');
  });

  it('should use div replace header when not in RecyclerView', () => {
    let component = renderer.create(
      <RecyclerView.Header/>
    );
    let tree = component.toJSON();
    expect(tree.tagName).toEqual('DIV');
  });
});

