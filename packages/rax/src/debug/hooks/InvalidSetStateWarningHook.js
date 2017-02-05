let processingChildContext = false;

const warnInvalidSetState = () => {
  console.warn('setState(...): Cannot call setState() inside getChildContext()');
};

const InvalidSetStateWarningHook = {
  onBeginProcessingChildContext() {
    processingChildContext = true;
  },
  onEndProcessingChildContext() {
    processingChildContext = false;
  },
  onSetState() {
    warnInvalidSetState();
  },
};

export default InvalidSetStateWarningHook;
