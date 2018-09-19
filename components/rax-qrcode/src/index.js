import {createElement, Component} from 'rax';
import Canvas from 'rax-canvas';
import StyleSheet from 'universal-stylesheet';
import qr from 'qr.js';

class QRCode extends Component {
  constructor(props) {
    super(props);
    const {style = {}} = props;
    const {width = 300, height = 300} = style;
    this.width = width;
    this.height = height;
    this.canvas = null;
  }

  componentDidMount() {
    const {data = '', options = {}} = this.props;
    if (data === '') {
      return;
    }
    this.drawCode(data, options);
  }

  componentWillReceiveProps(nextProps) {
    const {data, options} = nextProps;
    if (data !== this.props.data) {
      this.drawCode(data, options);
    }
  }

  canvasRef = (ref) => {
    this.canvas = ref;
  }

  drawCode = (data, options) => {
    if (this.canvas === null) {
      return;
    }
    const codeData = qr(data, options);
    const {fillColor = '#000000', blankColor = '#ffffff'} = options;
    const cells = codeData.modules;
    const tileWidth = this.width / cells.length;
    const tileHeight = this.height / cells.length;
    const ctx = this.canvas.getContext();

    for (let r = 0; r < cells.length; ++r) {
      const row = cells[r];
      for (let c = 0; c < row.length; ++c) {
        ctx.fillStyle = row[c] ? fillColor : blankColor;
        const w = Math.ceil((c + 1) * tileWidth) - Math.floor(c * tileWidth);
        const h = Math.ceil((r + 1) * tileHeight) - Math.floor(r * tileHeight);
        ctx.fillRect(Math.round(c * tileWidth), Math.round(r * tileHeight), w, h);
      }
    }
  }

  render() {
    const {style} = this.props;
    return (
      <Canvas
        style={[styles.qrCode, style]}
        ref={this.canvasRef}
      />
    );
  }
}

const styles = StyleSheet.create({
  qrCode: {
    width: 300,
    height: 300
  }
});

QRCode.ErrorCorrectLevel = qr.ErrorCorrectLevel;
export default QRCode;
