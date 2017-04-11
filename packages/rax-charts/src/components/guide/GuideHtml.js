import {createElement, Component} from 'rax';

export default class Html extends Component {
  constructor(props) {
    super(props);
    // config 可以没有，没有则传 undefined 进去
    const {chart, position, tooltipHtml, config} = props;
    return chart.guide().html(position, tooltipHtml, config);
  }
}

