import {createElement, Component} from 'rax';
export default class Coord extends Component {
  constructor(props) {
    super(props);
    const {chart, type, config} = props;

    if (!type && config) {
      return chart.coord(config);

    } else if (type && !config) {
      return chart.coord(type);

    } else if (type && config) {
      return chart.coord(type, config);

    }
  }
}
