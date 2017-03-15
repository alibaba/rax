import {createElement, Component} from 'rax';

/**
 * Creates a navigator based on a router and a view that renders the screens.
 */
const createNavigator = (router) =>
  (View) => {
    class Navigator extends Component {
      // props: NavigationNavigatorProps;

      static router = router;

      render() {
        return (
          <View
            {...this.props}
            router={router}
          />
        );
      }
    }

    return Navigator;
  };

export default createNavigator;
