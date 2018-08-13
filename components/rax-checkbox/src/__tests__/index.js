import Checkbox from '../index';
import renderer from 'rax-test-renderer';
import {createElement, Component} from 'rax';

class CheckboxTest extends Component {
  render() {
    return (
      <Checkbox />
    );
  }
}

describe('checkbox', () => {
  let component, component2;

  beforeEach(() => {
    component = renderer.create(
      <CheckboxTest />
    );
    component2 = renderer.create(
      <CheckboxTest checked={true} />
    );
  });

  it('render checkbox', () => {
    let tree = component.toJSON();
    expect(tree.tagName).toEqual('DIV');
  });

  it('checked on checkbox', () => {
    let tree = component2.toJSON();
    expect(tree.children[0].tagName).toEqual('DIV');
    expect(tree.children[0].children[0].tagName).toEqual('IMG');
    expect(tree.children[0].children[0].attributes.src).toEqual('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAYUExURUxpcTMzMzMzMzMzMzMzMzMzMzMzMzMzM2vW5DoAAAAHdFJOUwCPEO9AzzBOX/xUAAAASklEQVQoz+2SMRKAQAwCIcmF///YaKl4tYU7Q8O2CwRTD5IBxJJlBSixcKPOFzkzUAmpnGppFCy/+qpqZ2rUJgCbTV/ZbGJ7T/QAwyIE71akwQMAAAAASUVORK5CYII=');
  });
});
