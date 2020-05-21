// Both Page and Component
export const COMPONENT_WILL_MOUNT = 'componentWillMount';
export const RENDER = 'render';
export const COMPONENT_DID_MOUNT = 'componentDidMount';
export const COMPONENT_WILL_UNMOUNT = 'componentWillUnmount';
export const COMPONENT_WILL_RECEIVE_PROPS = 'componentWillReceiveProps';
export const COMPONENT_WILL_UPDATE = 'componentWillUpdate';
export const COMPONENT_DID_UPDATE = 'componentDidUpdate';

// App only
export const ON_LAUNCH = 'launch';
export const ON_ERROR = 'onError';

// Both App and Page
export const ON_SHOW = 'onShow';
export const ON_HIDE = 'onHide';
export const ON_SHARE_APP_MESSAGE = 'onShareAppMessage';
export const EVENTS_LIST = [
  'onBack',
  'onKeyboardHeight',
  'onOptionMenuClick',
  'onPopMenuClick',
  'onPullDownRefresh',
  'onPullIntercept',
  'onTitleClick',
  'onTabItemTap',
  'beforeTabItemTap',
  'onResize'
]; // These events above are only valid in events object in appx 2.0
