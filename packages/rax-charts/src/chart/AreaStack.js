import {createElement, Component} from 'rax';

export default class AreaStack extends Component {
  static draw = (chart, props) => {
    const {position, color, shape, style} = props;

    let area = chart.areaStack();

    color && area.color(color);
    position && area.position(position);
    shape && area.shape(shape);
    style && area.style(style);
  };
}
