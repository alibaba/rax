import {createElement, Component} from 'rax';

export default class Arc extends Component {
  constructor(props) {
    super(props);
    const {chart, from, to, config} = props;
    chart.guide().arc(from, to, config);
  }
}
