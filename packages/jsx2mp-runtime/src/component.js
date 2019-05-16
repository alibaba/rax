


import { setState, forceUpdate, hasOwn} from './common/utils';
import { componentCytleMap as CYCLE_MAP } from './common/cycle-config';
const INSTANCE = '__rax_instance__';
/**
 * Bridge from RaxComponent Klass to MiniApp Component constructor.
 * @param Klass {RaxComponent}
 * @return {Object} MiniApp Component constructor's config.
 */
export function createComponent(Klass) {
  const { prototype: klassPrototype, mixins, defaultProps } = Klass;
  /**
   * Expose config of component.
   */
  const config = {
    mixins,
    props: defaultProps,
    data() {
      const instance = new Klass({}, null);
      config[INSTANCE] = instance;
      return instance.state;
    },
    methods: {
      setState,
      forceUpdate,
    },
  };

  /**
   * Bind function class methods into methods or cycles.
   */
  const classMethods = Object.getOwnPropertyNames(klassPrototype);
  for (let i = 0, l = classMethods.length; i < l; i++) {
    const methodName = classMethods[i];
    if ('constructor' === methodName) continue;
    if (typeof klassPrototype[methodName] === 'function') {
      const fn = klassPrototype[methodName];
      if (hasOwn(CYCLE_MAP, methodName)) {
        config[CYCLE_MAP[methodName]] = fn;
      } else {
        config.methods[methodName] = fn;
      }
    }
  }
  return config;
}
