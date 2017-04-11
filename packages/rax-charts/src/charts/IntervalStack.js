import {createElement} from 'rax';
import Geom from '../geom';

export default class IntervalStack extends Geom {
  constructor(props) {
    const {chart} = props;
    const geomChart = chart.intervalStack();
    super({geomChart, ...props});
  }
}
