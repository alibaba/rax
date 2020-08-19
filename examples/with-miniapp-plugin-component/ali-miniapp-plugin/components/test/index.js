Component({
  props: {
<<<<<<< HEAD
    pluginName: 'plugin'
=======
    pluginName: ''
>>>>>>> master
  },
  methods: {
    onClick() {
      const { pluginName } = this.props;
      this.props.onTest && this.props.onTest(pluginName);
    }
  }
<<<<<<< HEAD
})
=======
});
>>>>>>> master
