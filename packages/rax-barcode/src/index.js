import {createElement, Component} from 'rax';
import Canvas from 'rax-canvas';
import StyleSheet from 'universal-stylesheet';

import barCodes from './barcodes';

class BarCode extends Component {
  constructor(props) {
    super(props);
    const {style = {}} = props;
    const {width = 500, height = 200} = style;
    this.width = width;
    this.height = height;
    this.canvas = null;
  }

  componentDidMount() {
    const {type = 'CODE128', data = '', options = {}} = this.props;
    if (data === '') {
      return;
    }
    this.drawCode(type, data, options);
  }

  componentWillReceiveProps(nextProps) {
    const {type = 'CODE128', data = '', options = {}} = nextProps;
    if (data !== this.props.data || type !== this.props.type) {
      this.drawCode(type, data, options);
    }
  }

  canvasRef = (ref) => {
    this.canvas = ref;
  }

  drawCode = (type, data, options) => {
    if (this.canvas === null) {
      return;
    }

    const Encoder = barCodes[type];
    const barCodeData = new Encoder(data, options);
    const {fillColor = '#000000', barWidth = 2} = options;
    this.canvas.getContext()
      .then((ctx) => {
        const binary = barCodeData.encode().data;
        ctx.clearRect(0, 0, this.width, this.height);
        ctx.fillStyle = fillColor;
        for (let i = 0; i < binary.length; i++) {
          const x = i * barWidth;
          if (binary[i] === '1') {
            ctx.fillRect(x, 0, barWidth, this.height);
          } else if (binary[i]) {
            ctx.fillRect(x, 0, barWidth, this.height * binary[i]);
          }
        }
      });
  }

  render() {
    const {style} = this.props;
    return (
      <Canvas
        style={[styles.barCode, style]}
        ref={this.canvasRef}
      />
    );
  }
}

const styles = StyleSheet.create({
  barCode: {
    width: 500,
    height: 200
  }
});

export default BarCode;
