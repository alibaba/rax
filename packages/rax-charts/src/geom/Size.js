import {createElement, Component, PropTypes} from 'rax';
import utils from '../utils';
export default class Size extends Component {
  static type='size';

  /**
   * @type {{dim, value}}
   * dim: 根据 dim 字段的值映射大小，使用默认的最大值 max:10 和最小值 min: 1。
   * value: number or function
   *        number: 值的大小
   *        function: 通过回调函数来控制图形的大小
   */
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
    } else if (!dim && value && utils.isNumber(value)) {

      chart = chart.size(value);
    } else if (dim && value && utils.isFunction(value)) {

      chart = chart.size(dim, value);
    }

    return chart;
  };
}
