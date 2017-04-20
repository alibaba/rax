export default class Coord {
  static draw = (chart, props) => {
    const {type = 'rect', transposed, inner} = props;

    chart.coord(type, {
      transposed,
      inner
    });
  };
}
