import fmtEvent from '../_util/fmtEvent';
Component({
  data: {
    direction: "vertical"
  },
  props: {
    className: '',
    style: "",
    horizontal: false,
    vertical: true,
    endReachedThreshold: 500,
    onEndReached: function onEndReached() {},
    onScroll: function onScroll() {}
  },
  didMount: function didMount() {
    if (this.props.horizontal) {
      this.setData({
        direction: 'horizontal'
      });
    }
  },
  methods: {
    onEndReached: function onEndReached(e) {
      var event = fmtEvent(this.props, e);
      this.props.onEndReached(event);
    },
    onScroll: function onScroll(e) {
      var event = fmtEvent(this.props, e);
      this.props.onScroll(event);
    }
  }
});