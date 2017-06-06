import renderer from 'rax-test-renderer';
import {createElement} from 'rax';
import View from 'rax-view';
import Waterfall from '../index';

describe('waterfall', () => {
  const component = renderer.create(
    <Waterfall
      style={{
        height: 500
      }}
      columnWidth={370}
      columnCount={2}
      columnGap={10}
      dataSource={[
        {
          height: 550,
          item: {}
        },
        {
          height: 624,
          item: {}
        },
        {
          height: 708,
          item: {}
        },
        {
          height: 600,
          item: {}
        },
        {
          height: 300,
          item: {}
        },
        {
          height: 100,
          item: {}
        }]}
      renderHeader={() => {
        return [
          <View key="1" style={{height: 100, backgroundColor: 'yellow', marginBottom: 20}}>header1</View>,
        ];
      }}
      renderFooter={() => {
        return <View key="3" style={{height: 100, backgroundColor: 'blue', marginTop: 20}}>footer1</View>;
      }}
      renderItem={(item, index) => {
        return (<View style={{height: item.height, backgroundColor: 'red', marginBottom: 20}}>
          {index}
        </View>);
      }} />
  );

  it('should render a waterfall', () => {
    let tree = component.toJSON();
    expect(tree.tagName).toEqual('DIV');
  });
});