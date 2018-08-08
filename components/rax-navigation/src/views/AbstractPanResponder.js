import PanResponder from 'universal-panresponder';
import invariant from 'invariant';

const EmptyPanHandlers = {
  onMoveShouldSetPanResponder: null,
  onPanResponderGrant: null,
  onPanResponderMove: null,
  onPanResponderRelease: null,
  onPanResponderTerminate: null,
  onPanResponderTerminationRequest: null,
};

/**
 * Abstract class that defines the common interface of PanResponder that handles
 * the gesture actions.
 */
export default class AbstractPanResponder {
  constructor() {
    const config = {};
    Object.keys(EmptyPanHandlers).forEach((name: string) => {
      const fn = this[name];
      config[name] = fn.bind(this);
    });

    this.panHandlers = PanResponder.create(config).panHandlers;
  }
}
