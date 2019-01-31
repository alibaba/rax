import Element from './Element';
import CanvasRenderingContext2D from './CanvasRenderingContext2D';

export default class CanvasElement extends Element {
  getContext(contextType) {
    if (contextType === '2d') {
      return new CanvasRenderingContext2D(this);
    } else {
      return null;
    }
  }
}
