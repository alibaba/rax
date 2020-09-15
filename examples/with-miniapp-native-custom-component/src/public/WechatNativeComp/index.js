Component({
  options: {
    multipleSlots: true
  },
  methods: {
    onClick() {
      this.triggerEvent('click');
    }
  }
});
