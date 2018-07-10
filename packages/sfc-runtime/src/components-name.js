import { kebabCase } from './utils';
/**
 * 修正组件名称
 * https://cn.vuejs.org/v2/guide/components.html#%E7%BB%84%E4%BB%B6%E5%91%BD%E5%90%8D%E7%BA%A6%E5%AE%9A
 * @param {Object} def
 */
export default function componentsName(def) {
  if (def.components) {
    const names = Object.keys(def.components);
    for (let i = 0, l = names.length; i < l; i++) {
      if (/[A-Z]/.test(names[i][0])) {
        const camelCase = names[i][0].toLowerCase() + names[i].slice(1);
        def.components[camelCase] = def.components[names[i]];
      }
      const kebabName = kebabCase(names[i]);
      def.components[kebabName] = def.components[names[i]];
    }
  }
}
