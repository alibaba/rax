import {createElement, Component} from 'rax';

export default class Axis extends Component {
  static draw = (chart, props) => {
    const {name = '', label = {
      fontSize: 14
    }, grid} = props;

    chart.axis(name, {
      label: label,
      grid
    });
  };
}
