const lifecycleMapping = {
  // componentWillMount: '',
  componentDidMount: 'didMount',
  componentWillReceiveProps: 'didUpdate',
  componentWillMount: 'didUnmount',
}

export function createComponent(Klass) {
  const instance = new Klass();
  const klassPrototype = Klass.prototype;
  const componentConfig = {
    mixins: Klass.mixins,
    props: Klass.defaultProps,
    data() {
      return { ...instance.state };
    },
    methods: {},
  };

  const protoProperties = Object.keys(klassPrototype);
  for (let i = 0, l = protoProperties.length; i < l; i++) {
    const key = protoProperties[i];
    if (typeof klassPrototype[key] === 'function') {
      if (lifecycleMapping[key]) {
        componentConfig[lifecycleMapping[key]] = klassPrototype[key];
      } else {
        componentConfig.methods[key] = klassPrototype[key];
      }
    }
  }
  return componentConfig;
}
