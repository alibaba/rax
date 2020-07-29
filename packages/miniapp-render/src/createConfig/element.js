// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp } from 'universal-env';
import createEventProxy from '../bridge/createEventProxy';
import cache from '../utils/cache';
import { getComponentLifeCycle } from '../bridge/lifeCycleAdapter';

export default function() {
  if (isMiniApp) {
    return {
      props: {
        r: {}
      },
      methods: createEventProxy(),
      ...getComponentLifeCycle({
        mount() {
          cache.setElementInstance(this);
        }
      })
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
      ...getComponentLifeCycle({
        mount() {
          cache.setElementInstance(this);
        }
      })
    };
  }
}
