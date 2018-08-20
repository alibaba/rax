import {createElement} from 'rax';
import renderer from 'rax-test-renderer';
import Text from 'rax-text';
import View from 'rax-view';
import Tabbar from '../index';

jest.mock('universal-env', () => {
  return {
    isWeex: true
  };
});

describe('Tabbar', function() {
  it('#not in embed', function() {
    const tabbarIns = renderer.create(
      <Tabbar>
        <Tabbar.Item selected={true}>
          <Text>content1</Text>
        </Tabbar.Item>
        <Tabbar.Item href="about:blank">
          <Text>content2</Text>
        </Tabbar.Item>
        <Tabbar.Item>
          <Text>content3</Text>
        </Tabbar.Item>
      </Tabbar>
    );
    tabbarIns._instance.refs.tab_0.onPress();
    tabbarIns._instance.refs.tab_1.onPress();
    // TODO
  });
});