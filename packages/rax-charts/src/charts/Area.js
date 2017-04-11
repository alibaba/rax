import {createElement} from 'rax';
import Geom from '../geom';

export default class Area extends Geom {
  constructor(props) {
    const {chart} = props;
    const geomChart = chart.area();
    super({geomChart, ...props});
  }
}
