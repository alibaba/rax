import {createElement, Component, PropTypes} from 'rax';

export default class Color extends Component {
  static propTypes = {
    dim: PropTypes.string,
    colors: PropTypes.oneOf(['array', 'func']),
  };

  constructor(props) {
    super(props);
    return this.draw();
  }

  draw = () => {
    let {chart, dim, colors} = this.props;

    if (dim && !colors) {
      chart = chart.color(dim);
    } else if (!dim && colors) {
      chart = chart.color(colors);
    } else if (dim && colors) {
      chart = chart.color(dim, colors);
    }

    return chart;
  };
}
