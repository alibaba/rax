import {createElement, Component, PropTypes} from 'rax';
import isArray from '../utils/isArray';
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
      throw Error('chart error: no position');
    }

    let chart = geomChart.position(position);

    if (!children) {
      return chart;
    }

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

    if (isArray(children) && children.length > 0) {
      children.forEach((item) => {
        newChildren(item);
      });
    } else {
      newChildren(children);
    }

    return chart;
  };

}
