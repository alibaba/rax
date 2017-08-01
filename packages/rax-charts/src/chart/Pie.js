export default class Pie {
  static draw = (chart, props) => {
    const {position, color, inner} = props;

    let pie = chart.intervalStack();

    position && pie.position(position);

    if (color) {
     typeof color === 'string' ? pie.color(color) : pie.color.apply(null, color);
    };

  };
}
