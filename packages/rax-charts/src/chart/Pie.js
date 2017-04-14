import {createElement, Component} from 'rax';

export default class Pie extends Component {
  static draw = (chart, props) => {
    const {position, color, inner} = props;

    let pie = chart.intervalStack();

    position && pie.position(position);
    color && pie.color(color);
  };
}
