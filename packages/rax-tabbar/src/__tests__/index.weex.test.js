import {createElement} from 'rax';
import renderer from 'rax-test-renderer';
import Text from 'rax-text';
import View from 'rax-view';

jest.mock('universal-env', () => {
  return {
    isWeex: true
  };
});

import Tabbar from '../index';


describe('Tabbar', function() {


  it('#not in embed', function() {
    const tabbarIns = renderer.create(
      <Tabbar horizontal={true}>
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
    expect('').toEqual('');
  });

  it('#in embed', function() {
    const tabbarIns = renderer.create(
      <Tabbar horizontal={true}>
        <Tabbar.Item selected={true}>
        </Tabbar.Item>
        <Tabbar.Item href="about:blank">
        </Tabbar.Item>
        <Tabbar.Item>
        </Tabbar.Item>
      </Tabbar>
    );


    expect('').toEqual('');
  });
});