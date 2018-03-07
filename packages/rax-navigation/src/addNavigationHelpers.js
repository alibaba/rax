/**
 * @flow
 *
 * Helpers for navigation.
 */
import NavigationActions from './NavigationActions';

export default function<S: *>(navigation) {
  return {
    ...navigation,
    goBack: (key?: ?string): boolean => navigation.dispatch(NavigationActions.back({
      key: key === undefined ? navigation.state.key : key,
    })),
    navigate: (
      routeName,
      params,
      action) =>
      navigation.dispatch(NavigationActions.navigate({
        routeName,
        params,
        action,
      })),
    /**
     * For updating current route params. For example the nav bar title and
     * buttons are based on the route params.
     * This means `setParams` can be used to update nav bar for example.
     */
    setParams: (params): boolean =>
      navigation.dispatch(NavigationActions.setParams({
        params,
        key: navigation.state.key,
      })),
  };
}
