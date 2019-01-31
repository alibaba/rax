import { registerElement, createElement } from '../Element';
import CanvasElement from '../CanvasElement';
import CanvasRenderingContext2D from '../CanvasRenderingContext2D';

describe('Canvas', () => {
  registerElement('canvas', CanvasElement);

  it('create canvas element', () => {
    const canvas = createElement('canvas');
    expect(typeof canvas.getContext).toEqual('function');
  });

  it('getContext', () => {
    const canvas = createElement('canvas');
    const context2d = canvas.getContext('2d');
    expect(context2d).toBeInstanceOf(CanvasRenderingContext2D);

    const contextOther = canvas.getContext('webgl');
    expect(contextOther).toBeNull();
  });

  describe('context2d', () => {
    it('property', () => {
      const canvas = createElement('canvas');
      const context2d = canvas.getContext('2d');

      expect(context2d.globalAlpha).toEqual(1);
      context2d.fillStyle = '#ff5000';
      expect(context2d.fillStyle).toEqual('#ff5000');
    });

    it('method', () => {
      const canvas = createElement('canvas');
      const context2d = canvas.getContext('2d');
      context2d.fill('with', 'args');
    });
  });
});
