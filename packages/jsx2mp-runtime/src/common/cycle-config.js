const COMPONENT_CYCLE_MAP = {
  componentWillUpdate: "deriveDataFromProps",
  componentWillmount: "onInit",
  componentDidMount: "didMount",
  componentDidUpdate: "didUpdate",
  componentWillUnmount: "didUnmount"
};
const PAGE_EVENT_HANDLE_LIST = [
  "onBack",
  "onKeyboardHeight",
  "onOptionMenuClick",
  "onPopMenuClick",
  "onPullIntercept",
  "onPullDownRefresh",
  "onTitleClick",
  "onTabItemTap",
  "beforeTabItemTap",
  "onResize"
];
const PAGE_CYCLE_LIST = [
  "componentDidMount",
  "componentDidUpdate",
  "componentWillMount",
  "componentWillReceiveProps",
  "componentWillUnmount",
  "componentWillUpdate",
  "shouldComponentUpdate"
];
export default {
  componentCytleMap: COMPONENT_CYCLE_MAP,
  pageEventHandleList: PAGE_EVENT_HANDLE_LIST,
  pageCycleList: PAGE_CYCLE_LIST
};
