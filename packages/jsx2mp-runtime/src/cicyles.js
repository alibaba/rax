function triggerCicyleEvent(instance, cicyleName, args = {}) {
  instance[cicyleName] &&
    typeof instance[cicyleName] === 'function' &&
    instance[cicyleName].call(instance, ...args);
}
const willMount = function(instance) {
  triggerCicyleEvent(instance || this.instance, 'componentWillMount');
};
const didMount = function(instance) {
  triggerCicyleEvent(instance || this.instance, 'componentDidMount');
};
const didUpdate = function(prevProps, prevData) {
  triggerCicyleEvent(this.instance, 'componentDidUpdate', {
    prevProps,
    prevData
  });
};
const didUnmount = function() {
  triggerCicyleEvent(this.instance, 'componentWillUnmount');
};
const onShow = function() {
  triggerCicyleEvent(this.instance, 'componentDidShow');
};
const onHide = function() {
  triggerCicyleEvent(this.instance, 'componentDidHide');
};
const onUnload = function() {
  triggerCicyleEvent(this.instance, 'componentWillUnmount');
};
const deriveDataFromProps = function(nextProps) {
  const nextState = this.instance.state;
  triggerCicyleEvent(this.instance, 'componentWillReceiveProps', {
    nextState,
    nextProps
  });
};

export default {
  willMount,
  didMount,
  didUpdate,
  didUnmount,
  deriveDataFromProps,
  onShow,
  onHide,
  onUnload
};
