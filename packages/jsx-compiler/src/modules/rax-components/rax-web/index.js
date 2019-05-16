Component({
  data: {},
  props: {
    src: '',
    onMessage: function onMessage() {}
  },
  didMount: function didMount() {},
  methods: {
    onMessage: function onMessage(e) {
      this.props.onMessage(e);
    }
  }
});