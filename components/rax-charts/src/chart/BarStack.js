export default class BarStack {
  static draw = (chart, props) => {
    const {position, color, setColorCallback, shape, style} = props;

    let bar = chart.intervalStack();

    color && bar.color(color, setColorCallback);
    position && bar.position(position);
  };
}
