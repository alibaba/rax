import {transformPropsAttrsToStyle, renamePropsAttr} from '../parseProps';

describe('parseProps.js', () => {
  it('transformPropsAttrsToStyle', () => {
    const props = {
      width: 100
    };
    const newProps = transformPropsAttrsToStyle(props, ['width']);
    expect(newProps.width).toBe(undefined);
    expect(newProps.style.width).toBe(100);
  });

  it('renamePropsAttr', () => {
    const props = {
      autoplay: true
    };
    const newProps = renamePropsAttr(props, 'autoplay', 'auto-play');
    expect(newProps['auto-play']).toBe(true);
    expect(newProps.autoplay).toBe(undefined);
  });
});
