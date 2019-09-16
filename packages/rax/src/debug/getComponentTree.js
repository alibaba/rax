import { INSTANCE, RENDERED_COMPONENT } from '../constant';

const CURRENT_ELEMENT = '__currentElement';

export default function getComponentTree(element) {
  var children = null;
  var props = null;
  var state = null;
  var context = null;
  var name = null;
  var type = null;
  var text = null;
  var nodeType = 'Native';
  // If the parent is a native node without rendered children, but with
  // multiple string children, then the `element` that gets passed in here is
  // a plain value -- a string or number.
  if (typeof element !== 'object') {
    nodeType = 'Text';
    text = element + '';
  } else if (element[CURRENT_ELEMENT] === null || element[CURRENT_ELEMENT] === false) {
    nodeType = 'Empty';
  } else if (element[RENDERED_COMPONENT]) {
    nodeType = 'NativeWrapper';
    children = [element[RENDERED_COMPONENT]];
    props = element[INSTANCE].props;
    state = element[INSTANCE].state;
    context = element[INSTANCE].context;
    if (context && Object.keys(context).length === 0) {
      context = null;
    }
  } else if (element[RENDERED_COMPONENT]) {
    children = childrenList(element[RENDERED_COMPONENT]);
  } else if (element[CURRENT_ELEMENT] && element[CURRENT_ELEMENT].props) {
    // This is a native node without rendered children -- meaning the children
    // prop is just a string or (in the case of the <option>) a list of
    // strings & numbers.
    children = element[CURRENT_ELEMENT].props.children;
  }

  if (!props && element[CURRENT_ELEMENT] && element[CURRENT_ELEMENT].props) {
    props = element[CURRENT_ELEMENT].props;
  }

  // != used deliberately here to catch undefined and null
  if (element[CURRENT_ELEMENT] != null) {
    type = element[CURRENT_ELEMENT].type;
    if (typeof type === 'string') {
      name = type;
    } else if (element.getName) {
      nodeType = 'Composite';
      name = element.getName();
      // 0.14 top-level wrapper
      // TODO(jared): The backend should just act as if these don't exist.
      if (element._renderedComponent && element[CURRENT_ELEMENT].props === element._renderedComponent[CURRENT_ELEMENT]) {
        nodeType = 'Wrapper';
      }
      if (name === null) {
        name = 'No display name';
      }
    } else if (element._text) {
      nodeType = 'Text';
      text = element._text;
    } else {
      name = type.displayName || type.name || 'Unknown';
    }
  }

  if (element[INSTANCE]) {
    // TODO: React ART currently falls in this bucket, but this doesn't
    // actually make sense and we should clean this up after stabilizing our
    // API for backends
    let inst = element[INSTANCE];
    if (inst[RENDERED_COMPONENT]) {
      children = childrenList(inst[RENDERED_COMPONENT]);
    }
  }

  return {
    nodeType,
    type,
    name,
    props,
    state,
    context,
    children,
    text
  };
}

function childrenList(children) {
  var res = [];
  for (var name in children) {
    res.push(children[name]);
  }
  return res;
}
