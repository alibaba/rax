// eslint-disable-next-line import/no-extraneous-dependencies
import { isWeChatMiniProgram } from 'universal-env';

const picker = {
  name: 'picker',
  props: [
    {
      name: 'disabled',
      get(domNode) {
        return !!domNode.getAttribute('disabled');
      },
    }, {
      name: 'name',
      get(domNode) {
        return domNode.getAttribute('name') || '';
      },
    }, {
      name: 'range',
      get(domNode) {
        const value = domNode.getAttribute('range');
        return value !== undefined ? value : [];
      },
    }, {
      name: 'rangeKey',
      get(domNode) {
        return domNode.getAttribute('range-key') || '';
      },
    }, {
      name: 'value',
      get(domNode) {
        const mode = domNode.getAttribute('mode') || 'selector';
        const value = domNode.getAttribute('value');
        if (mode === 'selector' || mode === 'multiSelector') {
          return +value || 0;
        } else if (mode === 'time') {
          return value || '';
        } else if (mode === 'date') {
          return value || '0';
        } else if (mode === 'region') {
          return value || [];
        }

        return value;
      },
    }, {
      name: 'animation',
      get(domNode) {
        return domNode.getAttribute('animation');
      }
    }
  ],
  singleEvents: [{
    name: 'onPickerCancel',
    eventName: 'cancel'
  }],
  functionalSingleEvents: [
    {
      name: 'onPickerChange',
      eventName: 'change',
      middleware(evt, domNode) {
        domNode.$$setAttributeWithoutUpdate('value', evt.detail.value);
      }
    }
  ]
};

if (isWeChatMiniProgram) {
  picker.props.concat([
    {
      name: 'mode',
      get(domNode) {
        return domNode.getAttribute('mode') || 'selector';
      },
    }, {
      name: 'start',
      get(domNode) {
        return domNode.getAttribute('start') || '';
      },
    }, {
      name: 'end',
      get(domNode) {
        return domNode.getAttribute('end') || '';
      },
    }, {
      name: 'fields',
      get(domNode) {
        return domNode.getAttribute('fields') || 'day';
      },
    }, {
      name: 'customItem',
      get(domNode) {
        return domNode.getAttribute('custom-item') || '';
      }
    }
  ]);
  picker.singleEvents.push({
    name: 'onPickerColumnChange',
    eventName: 'columnchange'
  });
}

export default picker;
