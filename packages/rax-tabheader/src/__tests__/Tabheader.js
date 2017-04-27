import renderer from 'rax-test-renderer';
import {createElement} from 'rax';
import Text from 'rax-text';
import View from 'rax-view';
import TabHeader from '../index';

describe('tabheader', () => {
  const component = renderer.create(
    <TabHeader
      style={{height: 80}}
      dataSource={['tab1', 'tab2', 'tab3', 'tab4', 'tab5', 'tab6', 'tab7', 'tab8']}
      renderItem={(item, index) => {
        return <View><Text>{item}</Text></View>;
      }}
      renderSelect={(item, index) => {
        return <View><Text>{item}</Text></View>;
      }}
      onPress={(index) => {}}
      onSelect={(index) => {}}
      selected={0}
      itemWidth={166}
      dropDownCols={4}
      type={'dropDown-border-scroll'} />
  );
  let tree = component.toJSON();

  it('should render a tabheader', () => {
    expect(1 + 1).toEqual(2);
    expect(tree.tagName).toEqual('DIV');
  });
});