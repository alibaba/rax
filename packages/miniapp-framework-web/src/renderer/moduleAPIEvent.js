/**
 * Handle with module API events.
 * @param event
 */
export default function moduleAPIEventHandler(event) {
  const { data: payload } = event;
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
}
