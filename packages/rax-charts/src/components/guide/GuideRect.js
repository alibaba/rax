import {createElement, Component} from 'rax';
export default class Rect extends Component {
  constructor(props) {
    super(props);
    const {chart, from, to, config} = props;
    return chart.guide().rect(from, to, config);
  }
}
