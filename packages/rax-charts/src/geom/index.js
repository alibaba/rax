import {createElement, Component, PropTypes} from 'rax';
import utils from '../utils';
import Color from './Color';
import Shape from './Shape';
import Size from './Size';
import Style from './Style';
export default class Geom extends Component {
  static propTypes = {
    position: PropTypes.string,
  };

  constructor(props) {
    super(props);
    return this.draw();
  }

  draw = () => {
    let {geomChart, position, children} = this.props;

    if (!position) {
      throw Error('图表使用必须指定 position 参数');
    }

    let chart = geomChart.position(position);

    if (!children) {
      return chart;
    }

    // Geom 里的四个方法执行不分先后顺序，所以这样写可以
    const newChildren = (item) => {
      const type = item.type;
      switch (type) {
        case Color:
          chart = new Color({chart, ...item.props});
          break;
        case Shape:
          chart = new Shape({chart, ...item.props});
          break;
        case Size:
          chart = new Size({chart, ...item.props});
          break;
        case Style:
          chart = new Style({chart, ...item.props});
          break;
      }
    };

    if (utils.isArray(children) && children.length > 0) {
      children.forEach((item) => {
        newChildren(item);
      });
    } else {
      newChildren(children);
    }

    return chart;
  };

}
