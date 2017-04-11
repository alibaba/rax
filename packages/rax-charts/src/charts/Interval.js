import {createElement, Component, findDOMNode} from 'rax';
import Geom from '../geom';

export default class Interval extends Geom {
  constructor(props) {
    const {chart} = props;
    const geomChart = chart.interval();
    super({geomChart, ...props});
  }
}
