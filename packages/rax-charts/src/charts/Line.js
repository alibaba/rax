import {createElement} from 'rax';
import Geom from '../geom';
export default class Line extends Geom {
  constructor(props) {
    const {chart} = props;
    const geomChart = chart.line();
    super({geomChart, ...props});
  }
}
