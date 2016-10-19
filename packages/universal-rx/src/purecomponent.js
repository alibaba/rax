import Component from './component';

/**
 * Pure component class.
 */
class PureComponent extends Component {
  constructor(props, context) {
    super(props, context);
  }

  isPureComponentClass() {}
}

export default PureComponent;
