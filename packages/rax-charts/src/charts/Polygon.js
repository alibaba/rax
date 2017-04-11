import {createElement} from 'rax';
import Geom from '../geom';

export default class Point extends Geom {
  constructor(props) {
    const {chart} = props;
    const geomChart = chart.schema();
    super({geomChart, ...props});
  }
}
