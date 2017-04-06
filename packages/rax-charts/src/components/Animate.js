import {createElement, Component} from 'rax';
export default class Animate extends Component {
  constructor(props) {
    super(props);
    const {chart, type, config} = props;

    if (type === 'waveh') {
      return chart.animate().waveh(config);

    } else if (type === 'wavec') {
      return chart.animate().wavec(config);

    } else if (type === 'scalex') {
      return chart.animate().scalex(config);

    } else if (type === 'scaley') {
      return chart.animate().scaley(config);

    } else if (type === 'scalexy') {
      return chart.animate().scalexy(config);
    }
  }
}
