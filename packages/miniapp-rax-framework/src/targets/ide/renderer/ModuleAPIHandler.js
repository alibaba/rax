/**
 * Protocol ModuleAPIEvent
 *  eg. pageScrollTo
 */
export function createModuleAPIHandler(window) {
  return function moduleAPIHandler({ data: payload }) {
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
    }
  };
}
