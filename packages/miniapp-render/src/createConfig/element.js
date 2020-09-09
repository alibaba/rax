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
        styleIsolation: 'shared',
        virtualHost: true
      },
      methods: createEventProxy(),
      ...getComponentLifeCycle({
        mount() {
          cache.setElementInstance(this);
          const window = cache.getWindow();
          const node = cache.getNode(window.__pageId, this.properties.r.nodeId);
          node._internal = this;
        }
      })
    };
  }
}
