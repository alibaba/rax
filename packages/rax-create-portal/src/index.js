import { render, createElement, useEffect } from 'rax';
import unmountComponentAtNode from 'rax-unmount-component-at-node';

function Portal(props) {
  useEffect(() => {
    // Nested render will cause error when hydrating, it should be trigger in useEffect.
    render(props.element, props.container, {
      parent: this
    });
  });

  useEffect(() => {
    return () => {
      unmountComponentAtNode(props.container);
    };
  }, [props.container]);

  return null;
}

export default function createPortal(element, container) {
  return createElement(Portal, {
    element,
    container,
  });
}
