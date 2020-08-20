Component({
  methods: {
    onClick() {
      this.props.onClick && this.props.onClick();
    }
  }
});
