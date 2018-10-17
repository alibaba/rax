/**
 * Return registred global components
 */
export default function getGlobalComponents() {
  return typeof __sfc_global_components__ !== 'undefined' // eslint-disable-line
    ? __sfc_global_components__ // eslint-disable-line
    : null;
}
