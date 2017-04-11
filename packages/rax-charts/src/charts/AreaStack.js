import {createElement} from 'rax';
import Geom from '../geom';

export default class AreaStack extends Geom {
  constructor(props) {
    const {chart} = props;
    const geomChart = chart.areaStack();
    super({geomChart, ...props});
  }
}
