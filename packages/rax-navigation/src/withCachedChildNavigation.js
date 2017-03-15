/* @flow */

import {createElement, PureComponent} from 'rax';
import addNavigationHelpers from './addNavigationHelpers';

type InjectedProps<N> = {
  childNavigationProps: {
    [key: string]: N,
  },
};

/**
 * HOC which caches the child navigation items.
 */
export default function withCachedChildNavigation<T: *, N: *>(
  Comp
) {
  return class extends PureComponent {

    static displayName = `withCachedChildNavigation(${Comp.displayName || Comp.name})`;

    props: T;

    componentWillMount() {
      this._updateNavigationProps(this.props.navigation);
    }

    componentWillReceiveProps(nextProps: T) {
      this._updateNavigationProps(nextProps.navigation);
    }

    // _childNavigationProps: {
    //   [key: string]: NavigationScreenProp<N, NavigationAction>,
    // };

    _updateNavigationProps = (
      navigation
    ) => {
      // Update props for each child route
      if (!this._childNavigationProps) {
        this._childNavigationProps = {};
      }
      navigation.state.routes.forEach((route: *) => {
        const childNavigation = this._childNavigationProps[route.key];
        if (childNavigation && childNavigation.state === route) {
          return;
        }
        this._childNavigationProps[route.key] = addNavigationHelpers({
          ...navigation,
          state: route,
        });
      });
    }

    render() {
      return (
        <Comp
          {...this.props}
          childNavigationProps={this._childNavigationProps}
        />
      );
    }
  };
}
