/** @jsx createElement */

import renderer from 'rax-test-renderer';
import {createElement} from 'rax';
import Text from 'rax-text';

import Tabbar from '../index';

describe('Tabbar', function() {
  it('#<Tabbar /> should render null', function() {
    const tabbarIns = renderer.create(
      <Tabbar />
    );
    const tabbarInsJSON = tabbarIns.toJSON();
    expect(tabbarInsJSON).toEqual(null);
  });

  location.search = '?_page_inside_embed_=true';
  it('#<Tabbar />inside embed and set autoHidden=true, should render null', function() {
    const tabbarIns = renderer.create(
      <Tabbar />
    );
    const tabbarInsJSON = tabbarIns.toJSON();
    expect(tabbarInsJSON).toEqual(null);
  });

  it('#if no declare tabContent, tabContent should render null', function() {
    const tabbarIns = renderer.create(
      <Tabbar>
        <Tabbar.Item />
        <Tabbar.Item />
        <Tabbar.Item />
      </Tabbar>
    );
    const tabbarInsJSON = tabbarIns.toJSON();
    expect(tabbarInsJSON.children.length).toEqual(1);
  });

  it('#tabbar horizontal', function() {
    const tabbarIns = renderer.create(
      <Tabbar horizontal={true}>
        <Tabbar.Item>
          <Text>content1</Text>
        </Tabbar.Item>
        <Tabbar.Item>
          <Text>content2</Text>
        </Tabbar.Item>
        <Tabbar.Item>
          <Text>content3</Text>
        </Tabbar.Item>
      </Tabbar>
    );
    const tabbarInsJSON = tabbarIns.toJSON();
    expect(tabbarInsJSON.children.length).toEqual(2);
  });

  it('#if declare tabContent, tabContent should not null', function() {
    const tabbarIns = renderer.create(
      <Tabbar>
        <Tabbar.Item>
          <Text>content1</Text>
        </Tabbar.Item>
        <Tabbar.Item>
          <Text>content2</Text>
        </Tabbar.Item>
        <Tabbar.Item />
      </Tabbar>
    );
    const tabbarInsJSON = tabbarIns.toJSON();
    expect(tabbarInsJSON.children.length).toEqual(2);
  });

  it('#position bottom', function() {
    const tabbarIns = renderer.create(
      <Tabbar position={'bottom'}>
        <Tabbar.Item>
          <Text>content1</Text>
        </Tabbar.Item>
        <Tabbar.Item>
          <Text>content2</Text>
        </Tabbar.Item>
        <Tabbar.Item>
          <Text>content3</Text>
        </Tabbar.Item>
      </Tabbar>
    );
    const tabbarInsJSON = tabbarIns.toJSON();
    expect(tabbarInsJSON.children.length).toEqual(2);
  });

  it('#background', function() {
    const tabbarIns = renderer.create(
      <Tabbar barTintColor="red" style={{backgroundImage: 'url("bg.jpg")'}}>
        <Tabbar.Item>
          <Text>content1</Text>
        </Tabbar.Item>
        <Tabbar.Item>
          <Text>content2</Text>
        </Tabbar.Item>
        <Tabbar.Item>
          <Text>content3</Text>
        </Tabbar.Item>
      </Tabbar>
    );
    const tabbarInsJSON = tabbarIns.toJSON();
    expect(tabbarInsJSON.children[0].style.backgroundColor).toEqual('red');
    expect(tabbarInsJSON.children[0].children.length).toEqual(2);
  });

  it('#Tabbar.Item Icon badge', function() {
    const tabbarIns = renderer.create(
      <Tabbar>
        <Tabbar.Item icon={{uri: 'a.jpg'}} selectedIcon={{uri: 'b.jpg'}}>
          <Text>content1</Text>
        </Tabbar.Item>
        <Tabbar.Item icon={{uri: 'a.jpg'}}>
          <Text>content2</Text>
        </Tabbar.Item>
        <Tabbar.Item icon={{uri: 'a.jpg'}} badge="2">
          <Text>content3</Text>
        </Tabbar.Item>
      </Tabbar>
    );
    const tabbarInsJSON = tabbarIns.toJSON();
    expect(tabbarInsJSON.children.length).toEqual(2);
  });

  it('#separateStyle', function() {
    const tabbarIns = renderer.create(
      <Tabbar>
        <Tabbar.Item icon={{uri: 'a.jpg'}} selectedIcon={{uri: 'b.jpg'}} style={{color: '#333333', fontSize: 24}}>
          <Text>content1</Text>
        </Tabbar.Item>
        <Tabbar.Item icon={{uri: 'a.jpg'}}>
          <Text>content2</Text>
        </Tabbar.Item>
        <Tabbar.Item icon={{uri: 'a.jpg'}} badge="2">
          <Text>content3</Text>
        </Tabbar.Item>
      </Tabbar>
    );
    const tabbarInsJSON = tabbarIns.toJSON();
    expect(tabbarInsJSON.children.length).toEqual(2);
  });
});