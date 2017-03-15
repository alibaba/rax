import {createElement} from 'rax';
import createNavigationContainer from '../createNavigationContainer';
import createNavigator from './createNavigator';
import CardStack from '../views/CardStack';
import StackRouter from '../routers/StackRouter';

export default (routeConfigMap, stackConfig = {}) => {
  const {
    containerOptions,
    initialRouteName,
    initialRouteParams,
    paths,
    headerComponent,
    headerMode,
    mode,
    cardStyle,
    onTransitionStart,
    onTransitionEnd,
    navigationOptions,
  } = stackConfig;
  const stackRouterConfig = {
    initialRouteName,
    initialRouteParams,
    paths,
    navigationOptions,
  };
  /* eslint-disable new-cap */
  const router = StackRouter(routeConfigMap, stackRouterConfig);
  return createNavigationContainer(createNavigator(router)(props =>
    <CardStack
      {...props}
      headerComponent={headerComponent}
      headerMode={headerMode}
      mode={mode}
      cardStyle={cardStyle}
      onTransitionStart={onTransitionStart}
      onTransitionEnd={onTransitionEnd}
    />
  ), containerOptions);
};
