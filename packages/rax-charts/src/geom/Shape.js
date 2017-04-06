import {createElement, Component, PropTypes} from 'rax';

export default class Shape extends Component {
  static type = 'shape';

  /**
   * @type {{dim, shapes}}
   * dim：映射至图形属性的数据源字段名。
   * shapes: 数组，图形的顺序跟字段的值对应；
   *         函数，通过回调函数设置图形类型
   *         其中用户可以自定义渲染形状
   */
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
