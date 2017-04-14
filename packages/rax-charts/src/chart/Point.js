import {createElement, Component} from 'rax';

export default class Point extends Component {
  static draw = (chart, props) => {
    const {position} = props;

    chart.point().position(position);
  };
}
