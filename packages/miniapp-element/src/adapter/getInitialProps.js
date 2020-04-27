// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp } from 'universal-env';

export default function() {
  if (isMiniApp) {
    return {
      props: {
        inCover: false
      }
    };
  } else {
    return {
      properties: {
        inCover: {
          type: Boolean,
          value: false
        }
      }
    };
  }
}
