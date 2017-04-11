import {createElement, Component} from 'rax';

export default class Line extends Component {
  constructor(props) {
    super(props);
    const {chart, from, to, config} = props;
    return chart.guide().line(from, to, config);
  }
}

