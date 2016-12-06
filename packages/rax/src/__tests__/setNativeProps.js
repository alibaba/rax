/* @jsx createElement */

import Host from '../vdom/host';
import setNativeProps from '../setNativeProps';

describe('setNativeProps', () => {
  beforeEach(() => {
    Host.driver = null;
  });

  afterEach(() => {
    Host.driver = null;
  });

  it('set native props', () => {
    let setStyles = jest.fn();
    let addEventListener = jest.fn();
    let setAttribute = jest.fn();

    Host.driver = {
      setStyles,
      addEventListener,
      setAttribute,
    };

    let node = {
      nodeType: 1
    };

    let style = {
      foo: 1
    };

    let onPress = () => {};
    let id = 'test';

    setNativeProps(node, {
      style,
      onPress,
      id
    });

    expect(setStyles).toBeCalledWith(node, style);
    expect(addEventListener).toBeCalledWith(node, 'press', onPress);
    expect(setAttribute).toBeCalledWith(node, 'id', id);
  });
});
