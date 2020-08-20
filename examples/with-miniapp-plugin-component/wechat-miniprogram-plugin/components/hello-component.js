// plugin/components/hello-component.js
Component({
  properties: {
    list: {
      type: Array,
      value: [],
      observer: function(newVal, oldVal, changedPath) {
        this.setData({ list: newVal });
      }
    }
  },

  data: {
    list: []
  },

  methods: {
    onClick() {
      this.triggerEvent('Test');
    }
  }
});
