const BASE_FONT_SIZE = 28;

const defaultParagraphStyle = {
  fontSize: BASE_FONT_SIZE,
  marginTop: BASE_FONT_SIZE,
  marginBottom: BASE_FONT_SIZE
};

const TypographyElements = {
  u: {
    textDecoration: 'underline'
  },
  del: {
    textDecoration: 'line-through'
  },
  em: {
    fontStyle: 'italic'
  },
  b: {
    fontWeight: 'bold'
  },
  strong: {
    fontWeight: 'bold'
  },
  big: {
    fontSize: BASE_FONT_SIZE * 1.2
  },
  small: {
    fontSize: BASE_FONT_SIZE * 0.8
  }
};

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
  let props = child.props;
  let style = props.style;
  let nestedChildren = props.children;
  // Alias img
  if (type === 'img') {
    type = 'image';
  }

  if (TypographyElements[type]) {
    type = 'span';
    style = {
      ...TypographyElements[type],
      ...style
    };
  }

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
    let children = props.children;

    component.type = 'richtext';

    props.style = {
      ...defaultParagraphStyle,
      ...props.style
    };

    props.value = transformChildren(children); ;
    props.children = null;

    return component;
  }
};
