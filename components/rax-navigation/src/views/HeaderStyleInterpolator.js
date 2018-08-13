/* @flow */

import I18nManager from '../I18nManager';

/**
 * Utility that builds the style for the navigation header.
 *
 * +-------------+-------------+-------------+
 * |             |             |             |
 * |    Left     |   Title     |   Right     |
 * |  Component  |  Component  | Component   |
 * |             |             |             |
 * +-------------+-------------+-------------+
 */

function forLeft(props): Object {
  const { position, scene } = props;
  const { index } = scene;
  return {
    opacity: position.interpolate({
      inputRange: [index - 1, index, index + 1],
      outputRange: [0, 1, 0],
    }),
  };
}

function forCenter(props): Object {
  const { position, scene } = props;
  const { index } = scene;
  return {
    opacity: position.interpolate({
      inputRange: [index - 1, index, index + 1],
      outputRange: [0, 1, 0],
    }),
    transform: [
      {
        translateX: position.interpolate({
          inputRange: [index - 1, index + 1],
          outputRange: I18nManager.isRTL ?
            [-200, 200] :
            [200, -200],
        }),
      },
    ],
  };
}

function forRight(props) {
  const { position, scene } = props;
  const { index } = scene;
  return {
    opacity: position.interpolate({
      inputRange: [index - 1, index, index + 1],
      outputRange: [0, 1, 0],
    }),
  };
}

export default {
  forLeft,
  forCenter,
  forRight,
};
