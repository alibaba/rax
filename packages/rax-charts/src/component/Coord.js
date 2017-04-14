import {createElement, Component} from 'rax';

export default class Coord extends Component {
  static draw = (chart, props) => {
    const {type = 'rect', transposed, inner} = props;

    chart.coord(type, {
      transposed,
      inner
    });
  };
}
