import {createElement, Component, render} from 'rax';
import Chart, {Pie, Coord} from 'rax-charts';

class PieRoseDemo extends Component {
  render() {
    const pieRoseData = [
      {tem: 7, city: 'tokyo'},
      {tem: 4, city: 'newYork'},
      {tem: 3, city: 'berlin'}
    ];

    return <Chart style={{
      width: 750,
      height: 350
    }} data={pieRoseData} config={{
      tem: {
        min: 0,
        nice: false
      }
    }}>
      <Coord type="polar" inner={0} transposed={false} />
      <Pie position="city*tem" color="city" />
    </Chart>;
  }
}

export default PieRoseDemo;
