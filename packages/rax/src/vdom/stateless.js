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
    return this.pureRender(this.props, this.context);
  }
}

export default StatelessComponent;
