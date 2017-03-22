function transformString(string) {
  return {
    type: 'span',
    attr: {
      value: string
    }
  };
}

function transformChild(child) {
  let type = child.type;
  if (type === 'img') {
    type = 'image';
  }

  let props = child.props;
  let style = props.style;
  let nestedChildren = props.children;

  props.style = null;
  props.children = null;

  let element = {
    type,
    style,
    attr: props || {}
  };

  if (nestedChildren) {
    if (type === 'span' && typeof nestedChildren === 'string') {
      element.attr.value = nestedChildren;
    } else {
      element.children = transformChildren(nestedChildren);
    }
  }

  return element;
}

function transformChildren(children) {
  let elements = [];
  if (!Array.isArray(children)) {
    children = [children];
  }

  for (let i = 0; i < children.length; i++) {
    let child = children[i];
    if (typeof child === 'string') {
      elements.push(transformString(child));
    } else if (typeof child === 'object') {
      elements.push(transformChild(child));
    }
  }

  return elements;
}

export default {
  parse(component) {
    let {props} = component;
    component.type = 'richtext';

    let children = props.children;
    // Current only support span, a and img
    props.value = transformChildren(children); ;
    props.children = null;

    return component;
  }
};
