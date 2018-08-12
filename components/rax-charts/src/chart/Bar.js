export default class Bar {
  static draw = (chart, props) => {
    const {position, color, setColorCallback, shape, style} = props;

    let bar = chart.interval();

    color && bar.color(color, setColorCallback);
    position && bar.position(position);
  };
}
