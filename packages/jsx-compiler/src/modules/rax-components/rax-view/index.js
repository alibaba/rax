import fmtEvent from '../_util/fmtEvent';

Component({
  data: {},
  props: {
    className: '',
    style: '',
    onClick: function onClick() {},
    onLongpress: function onLongpress() {},
    onAppear: function onAppear() {},
    onDisAppear: function onDisAppear() {},
    onTouchStart: function onTouchStart() {},
    onTouchMove: function onTouchMove() {},
    onTouchEnd: function onTouchEnd() {},
    onTouchCancel: function onTouchCancel() {}
  },
  didMount: function didMount() {},
  methods: {
    onClick: function onClick(e) {
      var event = fmtEvent(this.props, e);
      this.props.onClick(event);
    },
    onLongpress: function onLongpress(e) {
      var event = fmtEvent(this.props, e);
      this.props.onLongpress(event);
    },
    onAppear: function onAppear(e) {
      var event = fmtEvent(this.props, e);
      this.props.onAppear(event);
    },
    onDisAppear: function onDisAppear(e) {
      var event = fmtEvent(this.props, e);
      this.props.onDisAppear(event);
    },
    onTouchStart: function onTouchStart(e) {
      var event = fmtEvent(this.props, e);
      this.props.onTouchStart(event);
    },
    onTouchMove: function onTouchMove(e) {
      var event = fmtEvent(this.props, e);
      this.props.onTouchMove(event);
    },
    onTouchEnd: function onTouchEnd(e) {
      var event = fmtEvent(this.props, e);
      this.props.onTouchEnd(event);
    },
    onTouchCancel: function onTouchCancel(e) {
      var event = fmtEvent(this.props, e);
      this.props.onTouchCancel(event);
    }
  }
});