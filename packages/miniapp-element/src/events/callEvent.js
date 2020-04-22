import render from 'miniapp-render';
import checkEventAccessDomNode from '../vdom/checkEventAccessDomNode';
import findParentNode from '../vdom/findParentNode';
import callSimpleEvent from './callSimpleEvent';

const { cache, EventTarget } = render.$$adapter;

export default function(eventName, evt, extra, pageId, nodeId) {
  const originNodeId =
    evt.currentTarget.dataset.privateNodeId || nodeId;
  const originNode = cache.getNode(pageId, originNodeId);

  if (!originNode) return;

  EventTarget.$$process(
    originNode,
    eventName,
    evt,
    extra,
    (domNode, evt, isCapture) => {
      // Delay triggering the jump until all synchronous callback processing is complete
      setTimeout(() => {
        if (evt.cancelable) return;
        const window = cache.getWindow();

        // Handle special node event
        if (
          domNode.tagName === 'LABEL' &&
          evt.type === 'click' &&
          !isCapture
        ) {
          // Handle label
          const forValue = domNode.getAttribute('for');
          let targetDomNode;
          if (forValue) {
            targetDomNode = window.document.getElementById(forValue);
          } else {
            targetDomNode = domNode.querySelector('input');

            // Find switch node
            if (!targetDomNode)
              targetDomNode = domNode.querySelector(
                'builtin-component[behavior=switch]'
              );
          }

          if (!targetDomNode || !!targetDomNode.getAttribute('disabled'))
            return;

          // Find target node
          if (targetDomNode.tagName === 'INPUT') {
            if (checkEventAccessDomNode(evt, targetDomNode, domNode))
              return;

            const type = targetDomNode.type;
            if (type === 'radio') {
              targetDomNode.setAttribute('checked', true);
              const name = targetDomNode.name;
              const otherDomNodes =
                window.document.querySelectorAll(`input[name=${name}]`) ||
                [];
              for (const otherDomNode of otherDomNodes) {
                if (
                  otherDomNode.type === 'radio' &&
                  otherDomNode !== targetDomNode
                ) {
                  otherDomNode.setAttribute('checked', false);
                }
              }
              callSimpleEvent(
                'change',
                { detail: { value: targetDomNode.value } },
                targetDomNode
              );
            } else if (type === 'checkbox') {
              targetDomNode.setAttribute('checked', !targetDomNode.checked);
              callSimpleEvent(
                'change',
                {
                  detail: {
                    value: targetDomNode.checked
                      ? [targetDomNode.value]
                      : []
                  }
                },
                targetDomNode
              );
            } else {
              targetDomNode.focus();
            }
          } else if (targetDomNode.tagName === 'BUILTIN-COMPONENT') {
            if (checkEventAccessDomNode(evt, targetDomNode, domNode))
              return;

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
          // Handle button click
          const type =
            domNode.tagName === 'BUTTON'
              ? domNode.getAttribute('type')
              : domNode.getAttribute('form-type');
          const formAttr = domNode.getAttribute('form');
          const form = formAttr
            ? window.document.getElementById('formAttr')
            : findParentNode(domNode, 'FORM');

          if (!form) return;
          if (type !== 'submit' && type !== 'reset') return;

          const inputList = form.querySelectorAll('input[name]');
          const textareaList = form.querySelectorAll('textarea[name]');
          const switchList = form
            .querySelectorAll('builtin-component[behavior=switch]')
            .filter(item => !!item.getAttribute('name'));
          const sliderList = form
            .querySelectorAll('builtin-component[behavior=slider]')
            .filter(item => !!item.getAttribute('name'));
          const pickerList = form
            .querySelectorAll('builtin-component[behavior=picker]')
            .filter(item => !!item.getAttribute('name'));

          if (type === 'submit') {
            const formData = {};
            if (inputList.length) {
              inputList.forEach(item => {
                if (item.type === 'radio') {
                  if (item.checked) formData[item.name] = item.value;
                } else if (item.type === 'checkbox') {
                  formData[item.name] = formData[item.name] || [];
                  if (item.checked) formData[item.name].push(item.value);
                } else {
                  formData[item.name] = item.value;
                }
              });
            }
            if (textareaList.length)
              textareaList.forEach(
                item => formData[item.getAttribute('name')] = item.value
              );
            if (switchList.length)
              switchList.forEach(
                item =>
                  formData[
                    item.getAttribute('name')
                  ] = !!item.getAttribute('checked')
              );
            if (sliderList.length)
              sliderList.forEach(
                item =>
                  formData[item.getAttribute('name')] =
                    +item.getAttribute('value') || 0
              );
            if (pickerList.length)
              pickerList.forEach(
                item =>
                  formData[item.getAttribute('name')] = item.getAttribute(
                    'value'
                  )
              );

            callSimpleEvent(
              'submit',
              { detail: { value: formData }, extra: { $$from: 'button' } },
              form
            );
          } else if (type === 'reset') {
            if (inputList.length) {
              inputList.forEach(item => {
                if (item.type === 'radio') {
                  item.setAttribute('checked', false);
                } else if (item.type === 'checkbox') {
                  item.setAttribute('checked', false);
                } else {
                  item.setAttribute('value', '');
                }
              });
            }
            if (textareaList.length)
              textareaList.forEach(item => item.setAttribute('value', ''));
            if (switchList.length)
              switchList.forEach(item =>
                item.setAttribute('checked', undefined)
              );
            if (sliderList.length)
              sliderList.forEach(item =>
                item.setAttribute('value', undefined)
              );
            if (pickerList.length)
              pickerList.forEach(item =>
                item.setAttribute('value', undefined)
              );

            callSimpleEvent(
              'reset',
              { extra: { $$from: 'button' } },
              form
            );
          }
        }
      }, 0);
    }
  );
}
