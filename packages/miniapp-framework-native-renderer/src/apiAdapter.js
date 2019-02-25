/**
 * Handler for my api context.
 */
export default function setupAPIAdapter(runtime) {
  /**
   * Video context protocol
   */
  runtime.$on('[[VideoContextAction]]', ({ data }) => {
    const { action, id, args } = data;
    let videoInstance = document.getElementById(id);
    if (videoInstance !== null) {
      videoInstance[action].apply(videoInstance, args);
    }
  });

  /**
   * Module api event protocol
   */
  runtime.$on('[[ModuleAPIEvent]]', ({ data: payload }) => {
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
  });
}
