import {createElement, Component, PropTypes} from 'rax';

export default class Def extends Component {
  static type = 'def';

  static propTypes = {
    dim: PropTypes.string.isRequired,
    type: PropTypes.string,
    formatter: PropTypes.func,
    values: PropTypes.array,
    range: PropTypes.array,
    alias: PropTypes.string,
  };
}
