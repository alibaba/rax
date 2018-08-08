export default class Pie {
  static draw = (chart, props) => {
    const {position, color, inner} = props;

    let pie = chart.intervalStack();

    position && pie.position(position);

    if (Array.isArray(color)) {
      pie.color.apply(null, color);
    } else if (color) {
      pie.color(color);
    }
  };
}
