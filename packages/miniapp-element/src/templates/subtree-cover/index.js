Component({
  props: {
    childNodes: [],
    onTouchStart: null,
    onTouchMove: null,
    onTouchEnd: null,
    onTouchCancel: null,
    onTap: null,
    onLoad: null,
    onError: null
  },
  methods: {
    onTouchStart(e) {
      this.props.onTouchStart && this.props.onTouchStart(e);
    },
    onTouchMove(e) {
      this.props.onTouchMove && this.props.onTouchMove(e);
    },
    onTouchEnd(e) {
      this.props.onTouchEnd && this.props.onTouchEnd(e);
    },
    onTouchCancel(e) {
      this.props.onTouchCancel && this.props.onTouchCancel(e);
    },
    onTap(e) {
      this.props.onTap && this.props.onTap(e);
    },
    onImgLoad(e) {
      this.props.onLoad && this.props.onLoad(e);
    },
    onImgError(e) {
      this.props.onError && this.props.onError(e);
    },
  }
});
