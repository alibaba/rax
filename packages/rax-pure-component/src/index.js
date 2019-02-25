import Component from 'rax-component';

/**
 * Pure component class.
 */
class PureComponent extends Component {
  constructor(props, context) {
    super(props, context);
    this.isPureComponent = true;
  }
}

export default PureComponent;
