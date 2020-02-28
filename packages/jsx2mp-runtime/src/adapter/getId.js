/* global PROPS, TAGID, PARENTID */
// eslint-disable-next-line import/no-extraneous-dependencies
import { isQuickApp } from 'universal-env';

let _customId = 0;

/**
 * Get instance TAGID or PARENTID
 * */
export default function(type, internal) {
  switch (type) {
    case 'tag':
      if (isQuickApp && internal.tagId) {
        // there's no inner props in quickapp
        return internal.tagId;
      }
      return internal[PROPS][TAGID] === undefined ? `t_${_customId++}` : internal[PROPS][TAGID];
    case 'parent':
      if (isQuickApp) {
        return !internal._parent || !internal._parent.data || !internal._parent.data.tagId === undefined ? 'p_' + _customId++ : internal._parent.data.tagId;
      }
      return internal[PROPS][PARENTID] === undefined ? `p_${_customId++}` : internal[PROPS][PARENTID];
    default:
      // For troubleshoot
      return `d_${_customId++}`;
  }
}
