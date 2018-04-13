import Host from './host';

/**
 * Stateless Component Class Wrapper
 */
class StatelessComponent {
  constructor(pureRender) {
    // A stateless function
    this.pureRender = pureRender;
  }
  render() {
    if (process.env.NODE_ENV !== 'production') {
      Host.measurer && Host.measurer.beforeRender();
    }

    return this.pureRender(this.props, this.context);
  }
}

export default StatelessComponent;
