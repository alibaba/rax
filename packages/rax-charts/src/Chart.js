import {createElement, Component, PropTypes, findDOMNode} from 'rax';
import {isWeex, isWeb} from 'universal-env';
import Canvas from 'rax-canvas';

import GM from 'g2-mobile';

if (isWeb) {
  GM.Global.pixelRatio = 2;
}

class Chart extends Component {
  constructor(props) {
    super(props);
  }

  setRef = (ref) => {
    this.chartInstance = ref;
  };

  componentDidMount() {
    this.chartInstance.getContext().then((context) => {
      this.draw(context);
    });
  }

  draw(context) {
    const {children, data, config} = this.props;
    const el = findDOMNode(this.chartInstance);

    if (!children) {
      return;
    }

    this.chart = new GM.Chart({
      el,
      context
    });
    this.chart.source(data, config);
    this.chart.axis(false);

    this.renderChildren(context);
  }

  renderChildren(context) {
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
      <Canvas style={chartStyle} ref={this.setRef} />
    );
  }
}

export default Chart;
