import { createElement } from '../Element';

describe('Animation', () => {
  function animate(animation) {
    return [{
      config: {
        transformOrigin: 'top right',
        duration: 3000,
        timeFunction: 'ease-in-out',
        delay: 100
      },
      animation,
    }];
  }

  it('merge style', () => {
    const animationConfig = animate([['translate', [35]]]);
    const el = createElement('foo');
    el.style = {
      transform: 'rotate(30deg)'
    };
    el.animation = animationConfig;
    expect(el.animation).toEqual(animationConfig);
    expect(el.style).toMatchSnapshot();
  });

  it('translate', () => {
    const animationConfig = animate([['translate', [35]]]);
    const el = createElement('foo');
    el.animation = animationConfig;
    expect(el.animation).toEqual(animationConfig);
  });

  it('translate3d', () => {
    const animationConfig = animate([['translate3d', [35, 40, 0]]]);
    const el = createElement('foo');
    el.animation = animationConfig;
    expect(el.animation).toEqual(animationConfig);
  });

  it('scale', () => {
    const animationConfig = animate([['scale', [1.5]]]);
    const el = createElement('foo');
    el.animation = animationConfig;
    expect(el.animation).toEqual(animationConfig);
  });

  it('scale3d', () => {
    const animationConfig = animate([['scale3d', [1.5, 1.2, 1.0]]]);
    const el = createElement('foo');
    el.animation = animationConfig;
    expect(el.animation).toEqual(animationConfig);
  });

  it('rotateX', () => {
    const animationConfig = animate([['rotateX', [30]]]);
    const el = createElement('foo');
    el.animation = animationConfig;
    expect(el.animation).toEqual(animationConfig);
  });

  it('rotate3d', () => {
    const animationConfig = animate([['rotate3d', [30, 40, 50]]]);
    const el = createElement('foo');
    el.animation = animationConfig;
    expect(el.animation).toEqual(animationConfig);
  });
});
