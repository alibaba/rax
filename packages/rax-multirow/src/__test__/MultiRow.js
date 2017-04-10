
import renderer from 'rax-test-renderer';
import {createElement} from 'rax';
import {View, Text} from 'rax-components';
import MultiRow from '../index';



describe('MultiRow', function() {

  const component = renderer.create(
    <View>
      <MultiRow dataSource={['tom', 'jeck', 'lilei', 'hanmeimei']} cells={2} renderCell={(name, index) => {
        return <Text>{name}</Text>;
      }} />
    </View>
  );

  it('should render a multirow', () => {
    let tree = component.toJSON();
    expect(tree.tagName).toEqual('DIV');
    expect(tree.children[0].tagName).toEqual('DIV');
  });

  it('rows num in multirow', () => {
    let tree = component.toJSON();
    expect(tree.children[0].children[0].children.length).toEqual(2);
  });

  it('cols num in multirow', () => {
    let tree = component.toJSON();
    expect(tree.children[0].children[0].children[0].children.length).toEqual(2);
  });

  it('dataSource in multirow', () => {
    let tree = component.toJSON();
    expect(tree.children[0].children[0].children[0].children[0].children[0]).toEqual('tom');
    expect(tree.children[0].children[0].children[0].children[1].children[0]).toEqual('jeck');
    expect(tree.children[0].children[0].children[1].children[0].children[0]).toEqual('lilei');
    expect(tree.children[0].children[0].children[1].children[1].children[0]).toEqual('hanmeimei');
  });

});