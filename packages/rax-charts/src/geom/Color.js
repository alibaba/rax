import {createElement, Component, PropTypes} from 'rax';
export default class Color extends Component {
  /**
   * @type {{dim, colors}}
   * dim: 可以为映射至颜色属性的数据源字段名，如果数据源中不存在这个字段名的话，则按照常量进行解析，也可以直接指定某一个具体的颜色值 color，如 '#fff', 'white' 等
   * colors: 以数组格式传入指定颜色，分类的颜色将按照数组中的颜色确定。对于颜色的分配顺序，会默认按照原始数据源中字段的顺序进行分配
   *         或者[function]指定一个颜色的回调函数，用于高灵活度的用户自定义。
   */
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
