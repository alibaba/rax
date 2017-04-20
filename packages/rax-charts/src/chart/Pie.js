export default class Pie {
  static draw = (chart, props) => {
    const {position, color, inner} = props;

    let pie = chart.intervalStack();

    position && pie.position(position);
    color && pie.color(color);
  };
}
