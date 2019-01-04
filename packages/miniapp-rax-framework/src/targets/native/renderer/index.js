import createWindmill from '../../../../vendors/windmill-renderer.min';
import { getClientId, getPageName, parsePageQuery } from './env';
import domRender from './domRender';
import { debug, error } from '../../../core/debugger';
import { consoleDataCusumer } from './console';
import startRemoteInspect from './remoteInspect';
import { setupAppear } from '../../../core/renderer/appear';
import { setupTap } from '../../../core/renderer/tap';
import { setupTheme } from '../../../core/renderer/atagTheme';

setupAppear(window);
setupTap(window);

const windmill = createWindmill({});
const pageName = getPageName();
const clientId = getClientId();
const pageQuery = parsePageQuery();
const rendererStatus = {
  inited: false,
};

/**
 * video context protocol
 */
windmill.$on('[[VideoContextAction]]', ({ data }) => {
  const { action, id, args } = data;
  let videoInstance = document.getElementById(id);
  if (videoInstance !== null) {
    videoInstance[action].apply(videoInstance, args);
  }
});

/**
 * module api event protocol
 */
windmill.$on('[[ModuleAPIEvent]]', ({ data: payload }) => {
  const { type, data } = payload;
  switch (type) {
    case 'pageScrollTo': {
      const { behavior, scrollTop } = data;
      window.scrollTo({
        top: scrollTop || 0,
        behavior: behavior || 'auto',
      });
      break;
    }
    default:
      break;
  }
});

/**
 * r# means
 *   worker tell renderer that you can call domRender()  now!
 * renderer-init
 */
windmill.$on('r#', event => {
  if (rendererStatus.inited) {
    if (process.env.NODE_ENV !== 'production') {
      debug(`Can not init renderer twice, pageName ${pageName}`);
    }
    return;
  }

  domRender(windmill);

  rendererStatus.inited = true;
});

/**
 * console api
 */
windmill.$on('console', event => {
  consoleDataCusumer(event.data);
});

/**
 * atag theme: init css vars
 */
windmill.$call('miniApp.getConfig', {}, function(response) {
  const themeConfig = response ? response.themeConfig : {};
  setupTheme(themeConfig, window);
}, function(err) {
  error('miniApp.getConfig on err', err);
});

/**
 * protocol for trans data
 */
window.__renderer_to_worker__ = function(payload) {
  windmill.$emit(
    payload.type,
    {
      payload,
      pageName,
    },
    'AppWorker'
  );
};

/**
 * r$ means
 *   renderer-ready
 */
windmill.$emit(
  'r$',
  {
    clientId,
    pageName,
    pageQuery,
  },
  'AppWorker'
);

/**
 * Start remote debugger
 */
if (pageQuery.remoteInspectUrl) {
  startRemoteInspect(pageQuery.remoteInspectUrl);
}
