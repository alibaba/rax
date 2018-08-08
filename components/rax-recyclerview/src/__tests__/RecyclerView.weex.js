import {createElement, Component} from 'rax';
import renderer from 'rax-test-renderer';
import RecyclerView from '../';

jest.mock('universal-env', () => {
  return {
    isWeex: true
  };
});

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
  render() {
    let props = {
      ref: 'recycleview',
      _autoWrapCell: true,
      children: [].concat(this.renderHeader(), this.renderBody(), this.renderFooter())
    };
    return <RecyclerView {...props} />;
  }
}

describe('RecyclerView in weex', () => {
  let component;

  beforeEach(() => {
    component = renderer.create(
      <RecyclerViewTest />
    );
  });

  it('should render a RecyclerView', () => {
    let tree = component.toJSON();
    expect(tree.tagName).toEqual('LIST');
    expect(tree.children[1].children[0].children[0]).toEqual('header');
    expect(tree.children[2].children[0].children[0]).toEqual('1');
    expect(tree.children[3].children[0].children[0]).toEqual('2');
    expect(tree.children[4].children[0].children[0]).toEqual('3');
    expect(tree.children[5].children[0].children[0]).toEqual('footer');
  });

  it('should pass a object to children', () => {
    let props = {
      children: <span>header</span>
    };
    let component = renderer.create(
      <RecyclerView {...props} />
    );
    let tree = component.toJSON();
    expect(tree.children.length).toEqual(2);
  });

  it('should render real cell', () => {
    let props = {
      _autoWrapCell: true,
      children: <span>header</span>
    };
    let component = renderer.create(
      <RecyclerView {...props} />
    );
    let tree = component.toJSON();
    expect(tree.children[1].tagName).toEqual('CELL');
  });

  it('should use RecyclerView.Header replace view', () => {
    let props = {
      _autoWrapCell: true,
      children: <RecyclerView.Header>header</RecyclerView.Header>
    };
    let component = renderer.create(
      <RecyclerView {...props} />
    );
    let tree = component.toJSON();
    expect(tree.children[1].tagName).toEqual('HEADER');
  });

  it('should use div replace cell when not in RecyclerView', () => {
    let component = renderer.create(
      <RecyclerView.Cell />
    );
    let tree = component.toJSON();
    expect(tree.tagName).toEqual('DIV');
  });

  it('should use div replace header when not in RecyclerView', () => {
    let component = renderer.create(
      <RecyclerView.Header />
    );
    let tree = component.toJSON();
    expect(tree.tagName).toEqual('DIV');
  });
});
