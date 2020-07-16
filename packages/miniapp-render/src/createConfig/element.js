// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp } from 'universal-env';
import createEventProxy from '../bridge/createEventProxy';
import cache from '../utils/cache';

export default function() {
  if (isMiniApp) {
    return {
      props: {
        r: {}
      },
      methods: createEventProxy(),
      onInit() {
        cache.setElementInstance(this);
      }
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
      methods: createEventProxy(),
      created() {
        cache.setElementInstance(this);
      }
    };
  }
}
