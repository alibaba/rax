import {createElement, Component} from 'rax';
import Def from './Def';
import isArray from '../utils/isArray';
import isObject from '../utils/isObject';

export default class Defs extends Component {
  constructor(props) {
    super(props);
    const conf = this.generateConf();
    const {chart, data} = props;
    return chart.source(data, conf);
  }

  generateConf = () => {
    const {children} = this.props;
    const conf = {};
    if (!children) {
      return conf;
    }

    if (isArray(children) && children.length > 0) {
      children.forEach((item) => {
        if (item.type === Def) {
          conf[item.props.dim] = item.props;
        }
      });
    }

    if (isObject(children)) {
      conf[children.props.dim] = children.props;
    }

    return conf;
  }
}
