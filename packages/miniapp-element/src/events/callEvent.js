// eslint-disable-next-line import/no-extraneous-dependencies
import { isWeChatMiniProgram } from 'universal-env';
import render from 'miniapp-render';
import checkEventAccessDomNode from '../vdom/checkEventAccessDomNode';
import findParentNode from '../vdom/findParentNode';
import callSimpleEvent from './callSimpleEvent';

const { cache, EventTarget } = render.$$adapter;

export default function(eventName, evt, extra, pageId, nodeId) {
  const originNodeId = evt.currentTarget.dataset.privateNodeId || nodeId;
  const originNode = cache.getNode(pageId, originNodeId);

  if (!originNode) return;

  EventTarget.$$process(
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
                  'builtIn-component[behavior=switch]'
                );
            }

            if (!targetDomNode || !!targetDomNode.getAttribute('disabled'))
              return;

            if (targetDomNode.tagName === 'INPUT') {
              if (checkEventAccessDomNode(evt, targetDomNode, domNode)) return;
              targetDomNode.focus();
            } else if (targetDomNode.tagName === 'BUILTIN-COMPONENT') {
              if (checkEventAccessDomNode(evt, targetDomNode, domNode)) return;

              const behavior = targetDomNode.behavior;
              if (behavior === 'switch') {
                const checked = !targetDomNode.getAttribute('checked');
                targetDomNode.setAttribute('checked', checked);
                callSimpleEvent(
                  'change',
                  { detail: { value: checked } },
                  targetDomNode
                );
              }
            }
          } else if (
            (domNode.tagName === 'BUTTON' ||
              domNode.tagName === 'BUILTIN-COMPONENT' &&
                domNode.behavior === 'button') &&
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
              .querySelectorAll('builtin-component[behavior=switch]')
              .filter((item) => !!item.getAttribute('name'));
            const sliderList = form
              .querySelectorAll('builtin-component[behavior=slider]')
              .filter((item) => !!item.getAttribute('name'));
            const pickerList = form
              .querySelectorAll('builtin-component[behavior=picker]')
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
              if (form._formId) {
                detail.formId = form._formId;
                form._formId = null;
              }
              callSimpleEvent(
                'submit',
                { detail, extra: { $$from: 'button' } },
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

              callSimpleEvent('reset', { extra: { $$from: 'button' } }, form);
            }
          }
        }, 0);
      }
    }
  );
}
