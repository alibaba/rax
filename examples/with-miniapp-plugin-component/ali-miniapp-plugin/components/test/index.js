Component({
  props: {
    pluginName: ''
  },
  methods: {
    onClick() {
      const { pluginName } = this.props;
      this.props.onTest && this.props.onTest(pluginName);
    }
  }
})
