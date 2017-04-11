import {createElement, Component} from 'rax';

export default class Axis extends Component {
  constructor(props) {
    super(props);
    const {chart, dim, config} = props;

    return chart.axis(dim, config);
  }
}
