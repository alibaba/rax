import {createElement, Component} from 'rax';
export default class Axis extends Component {
  constructor(props) {
    super(props);
    const {chart, dim, config} = props;

    /**
     * chart.axis(dim, config) 设置字段 dim 对应的坐标轴样式
     * chart.axis(false) 不显示坐标轴，此时 dim 不传入， config 传 false 即可
     */
    return chart.axis(dim, config);
  }
}
