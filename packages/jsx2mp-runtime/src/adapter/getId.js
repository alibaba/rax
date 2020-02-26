import { isQuickapp } from 'universal-env';

/* global PROPS */
let _customId = 0;

/**
 * Get instance TAGID or PARENTID
 * */
export default function(type, internal) {
  if (isQuickapp) {
    switch (type) {
      case 'tag':
        if (internal.tagId) {
          return internal.tagId;
        }
        return internal._attrs.tagId === undefined ? 't_' + _customId++ : internal._attrs.tagId;
      case 'parent':
        return !internal._parent || !internal._parent.data || !internal._parent.data['tag-id'] === undefined ? 'p_' + _customId++ : internal._parent.data['tag-id'];
      default:
        // For troubleshoot
        return `d_${_customId++}`;
    }
  } else {
    switch (type) {
      case 'tag':
        return internal[PROPS][TAGID] === undefined ? `t_${_customId++}` : internal[PROPS][TAGID];
      case 'parent':
        return internal[PROPS][PARENTID] === undefined ? `p_${_customId++}` : internal[PROPS][PARENTID];
      default:
        // For troubleshoot
        return `d_${_customId++}`;
    }
  }
}
