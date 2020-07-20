import { createElement } from 'rax';
import { withRouter as spaWithRouter } from 'rax-use-router';
import { isMiniAppPlatform } from './env';

let withRouter = spaWithRouter;

if (isMiniAppPlatform) {
  withRouter = function(Component) {
    function Wrapper(props) {
      const history = window.history;
      return createElement(Component, Object.assign({}, props, {
        history: history,
        location: history.location
      }));
    };
    Wrapper.displayName = 'withRouter(' + (Component.displayName || Component.name) + ')';
    Wrapper.WrappedComponent = Component;
    return Wrapper;
  };
}

export default {
  // prev: { path, visibiltyState }
  // current: { path, visibiltyState }
  prev: null,
  current: null,
  withRouter
};
