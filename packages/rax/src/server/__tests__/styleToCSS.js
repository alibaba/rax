import styleToCSS from '../styleToCSS';
import {setRem} from 'style-unit';

describe('StyleToCSS', () => {
  it('convert unitless style to css', () => {
    let css = styleToCSS({
      background: 'black'
    });

    expect(css).toBe('background:black;');
  });

  it('convert rem unit style to css', () => {
    setRem(1);

    let css = styleToCSS({
      width: '750rem'
    });

    expect(css).toBe('width:750px;');

    let css2 = styleToCSS({
      width: '750rem'
    }, true);
    expect(css2).toBe('width:750rem;');
  });

  it('convert vendor prefix style to css', () => {
    let css = styleToCSS({
      WebkitBorder: 1
    });
    expect(css).toBe('-webkit-border:1px;');
  });
});
