import Host from './host';
/**
 * Stateless Component Class Wrapper
 */
class StatelessComponent {
  constructor(pureRender) {
    // A stateless class

    // A stateless function
    this.pureRender = pureRender;
  }
  render() {
    if (process.env.NODE_ENV !== 'production') {
      Host.hook.monitor && Host.hook.monitor.beforeRender();
    }

    return this.pureRender(this.props, this.context);
  }
}

export default StatelessComponent;
