export default class Axis {
  static draw = (chart, props) => {
    const {name = '', label = {
      fontSize: 14
    }, grid} = props;

    chart.axis(name, {
      label: label,
      grid
    });
  };
}
