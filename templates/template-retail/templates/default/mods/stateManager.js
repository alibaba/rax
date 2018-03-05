import { createElement, Component } from 'rax';
import hoistStatic from './hoistStatic';

const identity = i => i;
export const createReducer = (reducers) => {
  const actionTypes = Object.keys(reducers);
  return (state, action) => {
    const reducer = reducers[action.type] || identity;
    return reducer(state, action);
  };
};

const stateManager = (reducer, initState = {}) => BaseComponent => {
  class StateWrapper extends Component {
    state = initState;

    dispatch = (actionType, payload) => {
      const state = this.state;
      const nextState = reducer(state, { type: actionType, payload });
      // make sure Immutibility
      if (state !== nextState) {
        this.setState(nextState);
      }
    }

    render() {
      const props = {
        ...this.props,
        ...this.state,
        dispatch: this.dispatch
      };
      return <BaseComponent {...props} />;
    }
  }

  return hoistStatic(StateWrapper, BaseComponent);
};

export default stateManager;
