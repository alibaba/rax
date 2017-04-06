import {createElement, Component, render} from 'rax';
import Chart, {Area, Color, Shape, Style, Defs, Def, Axis, Global} from 'rax-charts';

class Page extends Component {

  render() {
    const data = [
      {'time': '2016-08-08 00:00:00', 'tem': 10, 'city': 'beijing'},
      {'time': '2016-08-08 00:10:00', 'tem': 22, 'city': 'beijing'},
      {'time': '2016-08-08 00:30:00', 'tem': 16, 'city': 'beijing'},
      {'time': '2016-08-09 00:35:00', 'tem': 26, 'city': 'beijing'},
      {'time': '2016-08-09 01:00:00', 'tem': 12, 'city': 'beijing'},
      {'time': '2016-08-09 01:20:00', 'tem': 26, 'city': 'beijing'},
      {'time': '2016-08-10 01:40:00', 'tem': 18, 'city': 'beijing'},
      {'time': '2016-08-10 02:00:00', 'tem': 26, 'city': 'beijing'},
      {'time': '2016-08-10 02:20:00', 'tem': 12, 'city': 'beijing'},
      {'time': '2016-08-08 00:00:00', 'tem': 28, 'city': 'newYork'},
      {'time': '2016-08-08 00:10:00', 'tem': 16, 'city': 'newYork'},
      {'time': '2016-08-08 00:30:00', 'tem': 26, 'city': 'newYork'},
      {'time': '2016-08-09 00:35:00', 'tem': 12, 'city': 'newYork'},
      {'time': '2016-08-09 01:00:00', 'tem': 26, 'city': 'newYork'},
      {'time': '2016-08-09 01:20:00', 'tem': 20, 'city': 'newYork'},
      {'time': '2016-08-10 01:40:00', 'tem': 29, 'city': 'newYork'},
      {'time': '2016-08-10 02:00:00', 'tem': 16, 'city': 'newYork'},
      {'time': '2016-08-10 02:20:00', 'tem': 22, 'city': 'newYork'}
    ];

    let label = {
      fill: '#979797',
      font: '14px san-serif',
      offset: 6
    };

    return (
      <div id="divdivdiv" style={{height: 800, backgroundColor: '#fff'}}>
        <Chart
          id="rax-chart-line-01-demo"
          width={750}
          height={400}
        >
          <Global pixelRatio={2} />
          <Defs data={data}>
            <Def dim="time" type="timeCat" mask="yyyy-mm-dd" tickCount={3} range={[0, 1]} />
            <Def dim="tem" tickCount={5} min={0} />
          </Defs>
          <Axis dim="tem" config={{
            label: {
              fontSize: 14
            }
          }} />
          <Axis dim="time" config={{
            //第一个点左对齐，最后一个点右对齐，其余居中，只有一个点时左对齐
            label: function(text, index, total) {
              const cfg = Chart.Util.mix({}, label);
              if (index === 0) {
                cfg.textAlign = 'start';
              }
              if (index > 0 && index === total - 1) {
                cfg.textAlign = 'end';
              }
              return cfg;
            }
          }} />
          <Area position="time*tem">
            <Color dim="city" />
            <Shape shapes="smooth" />
            <Style opacity={0.6} />
          </Area>
        </Chart>
      </div>
    );
  }
}

render(<Page />);
