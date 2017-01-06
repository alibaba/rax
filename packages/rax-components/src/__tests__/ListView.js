import {createElement, Component} from 'rax';
import renderer from 'rax-test-renderer';
import ListView from '../ListView';

jest.unmock('universal-env');

class ListViewTest extends Component {
  render() {
    return <ListView/>;
  }
}

describe('ListView', () => {
  let component;

  beforeEach(() => {
    component = renderer.create(
      <ListViewTest/>
    );
  });

  it('should render a ListView', () => {
    console.log(component);
    // let tree = component.toJSON();
    // console.log(tree);
    // expect(tree.tagName).toEqual('SPAN');
    // expect(tree.children[0].tagName).toEqual('SMALL');
  });

});

