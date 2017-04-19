import {createElement, Component, render} from 'rax';

import Bar from './Bar';
import BarRegion from './BarRegion';
import Area from './Area';
import AreaStack from './AreaStack';
import Line from './Line';
import LinePoint from './LinePoint';
import LineSmooth from './LineSmooth';
import Point from './Point';
import Pie from './Pie';
import PieRose from './PieRose';

class Page extends Component {
  render() {
    return <div>
      <Bar />
    </div>;
  }
}

render(<Page />);
