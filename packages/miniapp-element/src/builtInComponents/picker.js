// eslint-disable-next-line import/no-extraneous-dependencies
import { isWeChatMiniProgram } from 'universal-env';
import callSingleEvent from '../events/callSingleEvent';

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
      canBeUserChanged: true,
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
  handles: {
    onPickerChange(evt) {
      const domNode = this.getDomNodeFromEvt('change', evt);
      if (!domNode) return;

      domNode.$$setAttributeWithoutUpdate('value', evt.detail.value);
      domNode.__oldValues = domNode.__oldValues || {};
      domNode.__oldValues.value = evt.detail.value;
      callSingleEvent('change', evt, this);
    },
    onPickerCancel(evt) {
      callSingleEvent('cancel', evt, this);
    },
  }
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
  picker.handles.onPickerColumnChange = function(evt) {
    callSingleEvent('columnchange', evt, this);
  };
}

export default picker;
