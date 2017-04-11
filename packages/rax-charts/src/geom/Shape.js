import {createElement, Component, PropTypes} from 'rax';

export default class Shape extends Component {
  static type = 'shape';

  static propTypes = {
    dim: PropTypes.string,
    shapes: PropTypes.oneOf(['string', 'array', 'func']),
  };

  constructor(props) {
    super(props);
    return this.draw();
  }

  draw = () => {
    let {chart, dim, shapes} = this.props;
    if (dim && !shapes) {
      chart = chart.shape(dim);
    } else if (!dim && shapes) {
      chart = chart.shape(shapes);
    } else if (dim && shapes) {
      chart = chart.shape(dim, shapes);
    }

    return chart;
  };

}
