import {createElement, Component} from 'rax';

export default class Line extends Component {
  static draw = (chart, props) => {
    const {position, color, setColorCallback, shape, size} = props;

    let line = chart.line();

    position && line.position(position);
    color && line.color(color);
    size && line.size(size);
    shape && line.shape(shape);
  };
}
