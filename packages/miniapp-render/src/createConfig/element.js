// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp } from 'universal-env';
import createEventProxy from '../bridge/createEventProxy';

export default function() {
  if (isMiniApp) {
    return {
      props: {
        r: {}
      },
      methods: createEventProxy()
    };
  } else {
    return {
      properties: {
        r: {
          type: Object,
          value: {}
        }
      },
      options: {
        styleIsolation: 'shared'
      },
      methods: createEventProxy()
    };
  }
}
