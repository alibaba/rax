export default class Point {
  static draw = (chart, props) => {
    const {position} = props;

    chart.point().position(position);
  };
}
