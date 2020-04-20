import callSimpleEvent from '../events/callSimpleEvent';

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
    name: 'formType',
    get(domNode) {
      return domNode.getAttribute('form-type') || '';
    },
  }, {
    name: 'openType',
    get(domNode) {
      return domNode.getAttribute('open-type') || '';
    },
  }, {
    name: 'hoverClass',
    get(domNode) {
      return domNode.getAttribute('hover-class') || 'button-hover';
    },
  }, {
    name: 'hoverStopPropagation',
    get(domNode) {
      return !!domNode.getAttribute('hover-stop-propagation');
    },
  }, {
    name: 'hoverStartTime',
    get(domNode) {
      const value = parseInt(domNode.getAttribute('hover-start-time'), 10);
      return !isNaN(value) ? value : 20;
    },
  }, {
    name: 'hoverStayTime',
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
    name: 'sessionFrom',
    get(domNode) {
      return domNode.getAttribute('session-from') || '';
    },
  }, {
    name: 'sendMessageTitle',
    get(domNode) {
      return domNode.getAttribute('send-message-title') || '';
    },
  }, {
    name: 'sendMessagePath',
    get(domNode) {
      return domNode.getAttribute('send-message-path') || '';
    },
  }, {
    name: 'sendMessageImg',
    get(domNode) {
      return domNode.getAttribute('send-message-img') || '';
    },
  }, {
    name: 'appParameter',
    get(domNode) {
      return domNode.getAttribute('app-parameter') || '';
    },
  }, {
    name: 'showMessageCard',
    get(domNode) {
      return !!domNode.getAttribute('show-message-card');
    },
  }, {
    name: 'businessId',
    get(domNode) {
      return domNode.getAttribute('business-id') || '';
    },
  }, {
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }],
  handles: {
    onButtonGetUserInfo(evt) {
      callSimpleEvent('getuserinfo', evt, this.domNode);
    },
    onButtonContact(evt) {
      callSimpleEvent('contact', evt, this.domNode);
    },
    onButtonGetPhoneNumber(evt) {
      callSimpleEvent('getphonenumber', evt, this.domNode);
    },
    onButtonError(evt) {
      callSimpleEvent('error', evt, this.domNode);
    },
    onButtonOpenSetting(evt) {
      callSimpleEvent('opensetting', evt, this.domNode);
    },
    onButtonLaunchApp(evt) {
      callSimpleEvent('launchapp', evt, this.domNode);
    },

  },
};
