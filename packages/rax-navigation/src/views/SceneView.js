/* @flow */

import { createElement, PureComponent, PropTypes } from 'rax';

// type Props = {
//   screenProps?: {};
//   navigation: NavigationScreenProp<NavigationRoute, NavigationAction>;
//   component: Component<*>;
// };

export default class SceneView extends PureComponent {
  static childContextTypes = {
    navigation: PropTypes.object.isRequired,
  };

  // props: Props;

  getChildContext() {
    return {
      navigation: this.props.navigation,
    };
  }

  render() {
    const {
      screenProps,
      navigation,
      component: Component,
    } = this.props;

    return (
      <Component
        screenProps={screenProps}
        navigation={navigation}
      />
    );
  }
}
