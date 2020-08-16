/* global PROPS, TAGID */
// eslint-disable-next-line import/no-extraneous-dependencies
import { isQuickApp } from 'universal-env';

let _customId = 0;

/**
 * Get instance TAGID
 * */
export default function(type, internal) {
  switch (type) {
    case 'tag':
      if (isQuickApp && internal.tagId) {
        // there's no inner props in quickapp
        return internal.tagId;
      }
      if (internal[PROPS][TAGID]) {
        return internal[PROPS][TAGID];
      }
      return `t_${_customId++}`;
    default:
      // For troubleshoot
      return `d_${_customId++}`;
  }
}
