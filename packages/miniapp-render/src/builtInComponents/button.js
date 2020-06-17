export default {
  name: 'button',
  props: [{
    name: 'size',
    get(domNode) {
      return domNode.getAttribute('size') || 'default';
    },
  }, {
    name: 'type',
    get(domNode) {
      return domNode.getAttribute('type') || 'default';
    },
  }, {
    name: 'plain',
    get(domNode) {
      return !!domNode.getAttribute('plain');
    },
  }, {
    name: 'disabled',
    get(domNode) {
      return !!domNode.getAttribute('disabled');
    },
  }, {
    name: 'loading',
    get(domNode) {
      return !!domNode.getAttribute('loading');
    },
  }, {
    name: 'form-type',
    get(domNode) {
      return domNode.getAttribute('form-type') || '';
    },
  }, {
    name: 'open-type',
    get(domNode) {
      return domNode.getAttribute('open-type') || '';
    },
  }, {
    name: 'hover-class',
    get(domNode) {
      return domNode.getAttribute('hover-class') || 'button-hover';
    },
  }, {
    name: 'hover-stop-propagation',
    get(domNode) {
      return !!domNode.getAttribute('hover-stop-propagation');
    },
  }, {
    name: 'hover-start-time',
    get(domNode) {
      const value = parseInt(domNode.getAttribute('hover-start-time'), 10);
      return !isNaN(value) ? value : 20;
    },
  }, {
    name: 'hover-stay-time',
    get(domNode) {
      const value = parseInt(domNode.getAttribute('hover-stay-time'), 10);
      return !isNaN(value) ? value : 70;
    },
  }, {
    name: 'lang',
    get(domNode) {
      return domNode.getAttribute('lang') || 'en';
    },
  }, {
    name: 'session-from',
    get(domNode) {
      return domNode.getAttribute('session-from') || '';
    },
  }, {
    name: 'send-message-title',
    get(domNode) {
      return domNode.getAttribute('send-message-title') || '';
    },
  }, {
    name: 'send-message-path',
    get(domNode) {
      return domNode.getAttribute('send-message-path') || '';
    },
  }, {
    name: 'send-message-img',
    get(domNode) {
      return domNode.getAttribute('send-message-img') || '';
    },
  }, {
    name: 'app-parameter',
    get(domNode) {
      return domNode.getAttribute('app-parameter') || '';
    },
  }, {
    name: 'show-message-card',
    get(domNode) {
      return !!domNode.getAttribute('show-message-card');
    },
  }, {
    name: 'business-id',
    get(domNode) {
      return domNode.getAttribute('business-id') || '';
    },
  }, {
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }],
  singleEvents: [{
    name: 'onButtonGetUserInfo',
    eventName: 'getuserinfo'
  },
  {
    name: 'onButtonContact',
    eventName: 'contact'
  },
  {
    name: 'onButtonGetPhoneNumber',
    eventName: 'getphonenumber'
  },
  {
    name: 'onButtonError',
    eventName: 'error'
  },
  {
    name: 'onButtonOpenSetting',
    eventName: 'opensetting'
  },
  {
    name: 'onButtonLaunchApp',
    eventName: 'launchapp'
  }]
};
