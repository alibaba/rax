import {createElement, Component, PropTypes, findDOMNode} from 'rax';
import {isWeex} from 'universal-env';
import Canvas from 'rax-canvas';

import GM from './adaptGM';

if (!isWeex) {
  GM.Global.pixelRatio = 2;
}

class Chart extends Component {
  constructor(props) {
    super(props);
    this.id = `canvas_${parseInt(Math.random() * 899999 + 100000)}`;
  }

  componentDidMount() {
    this.refs[this.id].getContext().then((context) => {
      this.draw(context);
    });
  }

  draw(context) {
    const {children, data, config} = this.props;
    const el = findDOMNode(this.id);

    if (!children) {
      return;
    }

    context.render();
    this.chart = new GM.Chart({
      el,
      context
    });
    this.chart.source(data, config);
    this.chart.axis(false);

    this.renderChildren();
  }

  renderChildren() {
    let {children} = this.props;

    if (children && !Array.isArray(children)) {
      children = [children];
    }

    children.forEach((item) => {
      if (item.type && item.type.draw) {
        item.type.draw(this.chart, item.props);
      }
    });
    this.chart.render();
  }

  render() {
    let {style} = this.props;
    let chartStyle = {
      ...style
    };

    // weex canvas must have backgroundColor
    if (isWeex && !chartStyle.backgroundColor) {
      chartStyle.backgroundColor = '#ffffff';
    }

    return (
      <Canvas style={chartStyle} ref={this.id} id={this.id} />
    );
  }
}

export default Chart;
