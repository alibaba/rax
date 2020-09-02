export default {
  name: 'web-view',
  singleEvents: [{
    name: 'onWebviewMessage',
    eventName: 'message'
  },
  {
    name: 'onWebviewLoad',
    eventName: 'load'
  },
  {
    name: 'onWebviewError',
    eventName: 'error'
  }]
};
