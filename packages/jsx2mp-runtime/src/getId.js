/* global PROPS */
let _customId = 0;

/**
 * Get instance __tagId or __parentId
 * */
export default function getId(type, internal) {
  switch (type) {
    case 'tag':
      return internal[PROPS].__tagId === undefined ? `t_${_customId++}` : internal[PROPS].__tagId;
    case 'parent':
      return internal[PROPS].__parentId === undefined ? `p_${_customId++}` : internal[PROPS].__parentId;
    default:
      // For troubleshoot
      return `d_${_customId++}`;
  }
}
