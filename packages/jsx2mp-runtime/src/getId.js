/* global PROPS */
let _customId = 0;

/**
 * Get instance __tagId
 * */
export default function getId(type, internal) {
  switch (type) {
    case 'tag':
      if (internal[PROPS].__tagId) {
        return internal[PROPS].__tagId;
      }
      return `t_${_customId++}`;
    default:
      // For troubleshoot
      return `d_${_customId++}`;
  }
}
