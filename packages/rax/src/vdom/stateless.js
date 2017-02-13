import {DebugTool} from 'universal-perf';

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
      DebugTool.onBeginFlush();
    }

    return this.pureRender(this.props, this.context);
  }
}

export default StatelessComponent;
