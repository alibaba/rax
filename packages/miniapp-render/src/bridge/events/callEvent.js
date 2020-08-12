// eslint-disable-next-line import/no-extraneous-dependencies
import { isWeChatMiniProgram } from 'universal-env';
import EventTarget from '../../event/event-target';
import cache from '../../utils/cache';
import findParentNode from '../../utils/findParentNode';
import checkEventAccessDomNode from '../../utils/checkEventAccessDomNode';

export default function(eventName, evt, extra, pageId, nodeId) {
  const originNode = cache.getNode(pageId, nodeId);

  if (!originNode) return;
  EventTarget._process(
    originNode,
    eventName,
    evt,
    extra,
    (domNode, evt, isCapture) => {
      if (isWeChatMiniProgram) {
        setTimeout(() => {
          if (evt.cancelable) return;
          const window = cache.getWindow();

          if (
            domNode.tagName === 'LABEL' &&
            evt.type === 'click' &&
            !isCapture
          ) {
            const forValue = domNode.getAttribute('for');
            let targetDomNode;
            if (forValue) {
              targetDomNode = window.document.getElementById(forValue);
            } else {
              targetDomNode = domNode.querySelector('input');

              if (!targetDomNode)
                targetDomNode = domNode.querySelector(
                  'builtIn-component[_behavior=switch]'
                );
            }

            if (!targetDomNode || !!targetDomNode.getAttribute('disabled'))
              return;

            if (targetDomNode.tagName === 'INPUT') {
              if (checkEventAccessDomNode(evt, targetDomNode, domNode)) return;
              targetDomNode.focus();
            } else if (targetDomNode.tagName === 'BUILTIN-COMPONENT') {
              if (checkEventAccessDomNode(evt, targetDomNode, domNode)) return;

              const behavior = targetDomNode._behavior;
              if (behavior === 'switch') {
                const checked = !targetDomNode.getAttribute('checked');
                targetDomNode.setAttribute('checked', checked);
                this.callSimpleEvent(
                  'change',
                  { detail: { value: checked } },
                  targetDomNode
                );
              }
            }
          } else if (
            (domNode.tagName === 'BUTTON' ||
              domNode.tagName === 'BUILTIN-COMPONENT' &&
                domNode._behavior === 'button') &&
            evt.type === 'click' &&
            !isCapture
          ) {
            const type =
              domNode.tagName === 'BUTTON'
                ? domNode.getAttribute('type')
                : domNode.getAttribute('form-type');
            const formAttr = domNode.getAttribute('form');
            const form = formAttr
              ? window.document.getElementById(formAttr)
              : findParentNode(domNode, 'FORM');

            if (!form) return;
            if (type !== 'submit' && type !== 'reset') return;

            const inputList = form.querySelectorAll(
              'input[name]'
            );
            const textareaList = form.querySelectorAll(
              'textarea[name]'
            );
            const switchList = form
              .querySelectorAll('builtin-component[_behavior=switch]')
              .filter((item) => !!item.getAttribute('name'));
            const sliderList = form
              .querySelectorAll('builtin-component[_behavior=slider]')
              .filter((item) => !!item.getAttribute('name'));
            const pickerList = form
              .querySelectorAll('builtin-component[_behavior=picker]')
              .filter((item) => !!item.getAttribute('name'));

            if (type === 'submit') {
              const formData = {};
              if (inputList.length) {
                inputList.forEach((item) => {
                  formData[item.name] = item.value;
                });
              }
              if (textareaList.length)
                textareaList.forEach(
                  (item) => formData[item.name] = item.value
                );
              if (switchList.length)
                switchList.forEach(
                  (item) =>
                    formData[item.getAttribute('name')] = !!item.getAttribute(
                      'checked'
                    )
                );
              if (sliderList.length)
                sliderList.forEach(
                  (item) =>
                    formData[item.getAttribute('name')] =
                      +item.getAttribute('value') || 0
                );
              if (pickerList.length)
                pickerList.forEach(
                  (item) =>
                    formData[item.getAttribute('name')] = item.getAttribute(
                      'value'
                    )
                );

              const detail = { value: formData };
              if (form.__formId) {
                detail.formId = form.__formId;
                form.__formId = null;
              }
              this.callSimpleEvent(
                'submit',
                { detail, extra: { __from: 'button' } },
                form
              );
            } else if (type === 'reset') {
              if (inputList.length) {
                inputList.forEach((item) => {
                  item.setAttribute('value', '');
                });
              }
              if (textareaList.length)
                textareaList.forEach((item) => item.setAttribute('value', ''));
              if (switchList.length)
                switchList.forEach((item) =>
                  item.setAttribute('checked', undefined)
                );
              if (sliderList.length)
                sliderList.forEach((item) =>
                  item.setAttribute('value', undefined)
                );
              if (pickerList.length)
                pickerList.forEach((item) =>
                  item.setAttribute('value', undefined)
                );

              this.callSimpleEvent('reset', { extra: { __from: 'button' } }, form);
            }
          }
        }, 0);
      }
    }
  );
}
