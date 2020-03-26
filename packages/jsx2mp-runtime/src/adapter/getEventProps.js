// eslint-disable-next-line import/no-extraneous-dependencies
import { isQuickApp } from 'universal-env';

export default function() {
  // For quickapp
  if (isQuickApp) {
    return {
      TYPE: '_type',
      TARGET: '_target',
      TIMESTAMP: '_timeStamp',
    };
  } else {
    return {
      TYPE: 'type',
      TARGET: 'target',
      TIMESTAMP: 'timeStamp',
    };
  }
}
