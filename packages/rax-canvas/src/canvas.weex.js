const methods = ['clearRect', 'fillRect', 'setGlobalAlpha', 'setFillStyle', 'strokeRect', 'setLineWidth', 'setStrokeStyle'];
const properties = ['fillStyle', 'strokeStyle', 'lineWidth', 'globalAlpha'];

class Canvas {
  static getContext = (elemRef) => {
    if (typeof elemRef !== 'string') {
      elemRef = elemRef.ref;
    }
    return new Canvas(elemRef);
  };

  constructor(elemRef) {
    this.elemRef = elemRef;
    this.drawActionList = [];
    this._matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    this.fillStyle = 'white';
    this.strokeStyle = 'white';
    this._currentPoints = [];
    this.lineWidth = 1;
    this._globalAlpha = 1;
    this._stack = [];
  }

  beginPath() {
    this._currentPoints = [];
  }

  closePath() {
    this._currentPoints.push('L', this._currentPoints[1], this._currentPoints[2]);
  }

  moveTo(x, y) {
    this._currentPoints.push('M', x, y);
  }

  lineTo(x, y) {
    this._currentPoints.push('L', x, y);
  }

  arc(x, y, r, startAngle, endAngle, anticlockwise) {
    let step = Math.asin(1 / r);
    if (step < Math.PI / 180) {
      step = Math.PI / 180;
    }

    if (anticlockwise) {
      startAngle = Math.PI * 2 - startAngle;
      endAngle = Math.PI * 2 - endAngle;
      step = -step;
    }
    for (let angle = startAngle; step > 0 ? angle <= endAngle : angle >= endAngle; angle += step) {
      this._currentPoints.push('L', x + r * Math.cos(angle), y + r * Math.sin(angle));
    }
  }

  stroke() {
    this._pushDrawImages();
    this.drawActionList.push(['strokeLines', this._currentPoints]);
  }

  rotate(angle) {
    let sina = Math.sin(angle);
    let cosa = Math.cos(angle);
    let m00 = this._matrix[0];
    this._matrix[0] = m00 * cosa + this._matrix[3] * sina;
    this._matrix[3] = m00 * -sina + this._matrix[3] * cosa;

    let m01 = this._matrix[1];
    this._matrix[1] = m01 * cosa + this._matrix[4] * sina;
    this._matrix[4] = m01 * -sina + this._matrix[4] * cosa;
  }

  scale(x, y) {
    this._matrix[0] *= x;
    this._matrix[1] *= x;
    this._matrix[3] *= y;
    this._matrix[4] *= y;
  }

  resetTransform() {
    this._matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  }

  drawImage(img = {}, sx, sy, sw, sh, dx, dy, dw, dh) {
    if (typeof img !== 'object') {
      console.error('Failed to execute \'drawImage\' on Canvas: The provided value is not a Object');
      return;
    }

    let url = img.src;
    if (!url) {
      console.error('drawImage: the img is null');
      return;
    }

    if (arguments.length === 3) {
      dw = img.width;
      dh = img.height;
      dx = sx;
      dy = sy;
      sx = 0;
      sy = 0;
      sw = dw;
      sh = dh;
    }
    if (arguments.length === 5) {
      dx = sx;
      dy = sy;
      dw = sw;
      dh = sh;
      sx = 0;
      sy = 0;
      sw = img.width;
      sh = img.height;
    }
    let drawParams = [sx, sy, sw, sh, dx, dy, dw, dh];

    if (this._matrix.join('') !== '100010001') {
      drawParams = drawParams.concat(this._matrix);
    }
    if (this._lastDrawParams && this._lastDrawParams[0] === url) {
      this._lastDrawParams[1].push(drawParams);
    } else {
      if (this._lastDrawParams) {
        this.drawActionList.push(['drawImages', this._lastDrawParams]);
      }
      this._lastDrawParams = [url, [drawParams]];
    }
  }

  save() {
    this._stack.push({
      matrix: this._matrix.slice(),
      fillStyle: this._fillStyle,
      strokeStyle: this._strokeStyle,
      lineWidth: this._lineWidth,
      globalAlpha: this._globalAlpha
    });
  }

  restore() {
    let data = this._stack.pop();
    this._matrix = data.matrix;
    this.fillStyle = data.fillStyle;
    this.strokeStyle = data.strokeStyle;
    this.lineWidth = data.lineWidth;
    this.globalAlpha = data.globalAlpha;
  }

  _pushDrawImages() {
    if (this._lastDrawParams) {
      this.drawActionList.push(['drawImages', this._lastDrawParams]);
      this._lastDrawParams = null;
    }
  }

  draw() {
    const weexCanvasModule = require('@weex-module/canvas');
    this._pushDrawImages();
    weexCanvasModule.addDrawActions(this.elemRef, this.drawActionList);
    this.drawActionList = [];
  }

  translate(x, y) {
    this._matrix[6] = this._matrix[0] * x + this._matrix[3] * y + this._matrix[6];
    this._matrix[7] = this._matrix[1] * x + this._matrix[4] * y + this._matrix[7];
  }
}

methods.forEach((name) => {
  Canvas.prototype[name] = function() {
    const args = [name];
    if (arguments.length) {
      args.push([].slice.call(arguments));
    }
    this._pushDrawImages();
    this.drawActionList.push(args);
  };
});


function defineProperty(name) {
  Object.defineProperty(Canvas.prototype, name, {
    get: function() {
      return this['_' + name];
    },
    set: function(value) {
      if (value === this['_' + name]) {
        return;
      }
      this['_' + name] = value;
      this['set' + name.slice(0, 1).toUpperCase() + name.slice(1)](value);
    }
  });
}

properties.forEach(defineProperty);

export default Canvas;
