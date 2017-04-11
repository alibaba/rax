import {createElement, Component, PropTypes} from 'rax';
import isFunction from '../utils/isFunction';
import isNumber from '../utils/isNumber';

export default class Size extends Component {
  static type='size';

  static propTypes = {
    dim: PropTypes.string,
    value: PropTypes.oneOf(['number', 'func'])
  };

  constructor(props) {
    super(props);
    return this.draw();
  }

  draw = () => {
    let {chart, dim, value} = this.props;
    if (dim && !value) {
      chart = chart.size(dim);
    } else if (!dim && value && isNumber(value)) {
      chart = chart.size(value);
    } else if (dim && value && isFunction(value)) {
      chart = chart.size(dim, value);
    }

    return chart;
  };
}
