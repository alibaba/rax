import {createElement, Component, PropTypes} from 'rax';
import isObject from '../utils/isObject';

export default class Style extends Component {
  /**
   * @type {{lineWidth, fill, radius, stroke, fillOpacity, strokeOpacity, opacity}}
   * point: {
   *   lineWidth: 1,
   *   fill: '#999',
   *   radius: 4
   * },
   * hollowPoint: {
   *   fill: '#fff',
   *   lineWidth: 1,
   *   stroke: '#999',
   *   radius: 3
   * },
   * interval: {
   *   lineWidth: 0,
   *   fill: '#999',
   *   fillOpacity: 0.85
   * },
   * strokeInterval: {
   *  lineWidth: 1,
   *  stroke: '#fff'
   * },
   * pie: {
   *  lineWidth: 1,
   *  stroke: '#fff'
   * },
   * hollowInterval: {
   *   fill: '#fff',
   *   stroke: '#999',
   *   fillOpacity: 0,
   *   lineWidth: 1
   * },
   * area: {
   *   lineWidth: 0,
   *   fill: '#999',
   *   fillOpacity: 0.6
   * },
   * polygon: {
   *   lineWidth: 0,
   *   fill: '#999',
   *   fillOpacity: 1
   * },
   * hollowPolygon: {
   *   fill: '#fff',
   *   stroke: '#999',
   *   fillOpacity: 0,
   *   lineWidth: 1
   * },
   * strokePolygon: {
   *   fill: '#999',
   *   stroke: '#efefef',
   *   fillOpacity: 1
   * },
   * hollowArea: {
   *   fill: '#fff',
   *   stroke: '#999',
   *   fillOpacity: 0,
   *   lineWidth: 1
   * },
   * line: {
   *   stroke: '#999',
   *   lineWidth: 1,
   *   fill: null
   * }
   */
  static propTypes = {
    lineWidth: PropTypes.number,
    fill: PropTypes.string,
    radius: PropTypes.number,
    stroke: PropTypes.string,
    fillOpacity: PropTypes.number,
    strokeOpacity: PropTypes.number,
    opacity: PropTypes.number,
  };

  constructor(props) {
    super(props);
    return this.draw();
  }

  draw = () => {
    let {chart, ...item} = this.props;

    if (item && isObject(item)) {
      chart = chart.style(item);
    }

    return chart;
  };
}
