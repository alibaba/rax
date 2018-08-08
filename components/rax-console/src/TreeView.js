import {createElement, Component, PropTypes} from 'rax';
import TreeNode from './TreeNode';

const DEFAULT_ROOT_PATH = '$';
const WILDCARD = '*';

function hasChildNodes(data, dataIterator) {
  return !dataIterator(data).next().done;
}

const wildcardPathsFromLevel = level => {
  // i is depth
  return Array.from({ length: level }, (_, i) =>
    [DEFAULT_ROOT_PATH].concat(Array.from({ length: i }, () => '*')).join('.'),
  );
};

const getExpandedPaths = (
  data,
  dataIterator,
  expandPaths,
  expandLevel,
  initialState = {},
) => {
  let wildcardPaths = []
    .concat(wildcardPathsFromLevel(expandLevel))
    .concat(expandPaths)
    .filter(path => typeof path === 'string'); // could be undefined

  const expandedPaths = [];
  wildcardPaths.forEach(wildcardPath => {
    const keyPaths = wildcardPath.split('.');
    const populatePaths = (curData, curPath, depth) => {
      if (depth === keyPaths.length) {
        expandedPaths.push(curPath);
        return;
      }
      const key = keyPaths[depth];
      if (depth === 0) {
        if (
          hasChildNodes(curData, dataIterator) &&
          (key === DEFAULT_ROOT_PATH || key === WILDCARD)
        ) {
          populatePaths(curData, DEFAULT_ROOT_PATH, depth + 1);
        }
      } else {
        if (key === WILDCARD) {
          for (let { name, data } of dataIterator(curData)) {
            if (hasChildNodes(data, dataIterator)) {
              populatePaths(data, `${curPath}.${name}`, depth + 1);
            }
          }
        } else {
          const value = curData[key];
          if (hasChildNodes(value, dataIterator)) {
            populatePaths(value, `${curPath}.${key}`, depth + 1);
          }
        }
      }
    };

    populatePaths(data, '', 0);
  });

  return expandedPaths.reduce((obj, path) => {
    obj[path] = true;
    return obj;
  }, initialState);
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_EXPAND': {
      const path = action.path;
      const expandedPaths = state.expandedPaths;
      const expanded = !!expandedPaths[path];

      return Object.assign({}, state, {
        expandedPaths: Object.assign({}, state.expandedPaths, { [path]: !expanded }),
      });
    }
    default:
      return state;
  }
};

class ConnectedTreeNode extends Component {
  constructor(props, context) {
    super(props);

    this.state = context.store.storeState;
  }

  handleClick = (evt) => {
    this.context.store.storeState = reducer(this.context.store.storeState, {
      type: 'TOGGLE_EXPAND',
      path: this.props.path,
    });
    this.setState(this.context.store.storeState);
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !!nextState.expandedPaths[nextProps.path] !== !!this.state.expandedPaths[this.props.path] ||
      nextProps.data !== this.props.data ||
      nextProps.name !== this.props.name
    );
  }

  renderChildNodes(parentData, parentPath) {
    const { dataIterator } = this.props;
    const { depth } = this.props;

    const { nodeRenderer } = this.props;

    let childNodes = [];
    for (let { name, data, ...props } of dataIterator(parentData)) {
      const key = name;
      const path = `${parentPath}.${key}`;
      childNodes.push(
        <ConnectedTreeNode
          name={name}
          data={data}
          depth={depth + 1}
          path={path}
          key={key}
          dataIterator={dataIterator}
          nodeRenderer={nodeRenderer}
          {...props} // props for nodeRenderer
        />,
      );
    }
    return childNodes;
  }

  render() {
    const { data, dataIterator, path, depth, nodeRenderer } = this.props;

    const nodeHasChildNodes = hasChildNodes(data, dataIterator);
    const { expandedPaths } = this.state;
    const expanded = !!expandedPaths[path];

    return (
      <TreeNode
        expanded={expanded}
        onClick={nodeHasChildNodes ? this.handleClick : null}
        // show arrow anyway even if not expanded and not rendering children
        shouldShowArrow={nodeHasChildNodes}
        // show placeholder only for non root nodes
        shouldShowPlaceholder={depth > 0}
        // Render a node from name and data (or possibly other props like isNonenumerable)
        nodeRenderer={nodeRenderer}
        {...this.props}
      >
        {// only render if the node is expanded
          expanded ? this.renderChildNodes(data, path) : undefined}
      </TreeNode>
    );
  }
}

ConnectedTreeNode.propTypes = {
  name: PropTypes.string,
  data: PropTypes.any,
  dataIterator: PropTypes.func,

  depth: PropTypes.number,
  expanded: PropTypes.bool,

  nodeRenderer: PropTypes.func,
};

ConnectedTreeNode.contextTypes = {
  store: PropTypes.any,
};

class TreeView extends Component {
  static defaultProps = {
    expandLevel: 0,
    expandPaths: [],
  };

  constructor(props) {
    super(props);

    this.store = {
      storeState: {
        expandedPaths: getExpandedPaths(
          props.data,
          props.dataIterator,
          props.expandPaths,
          props.expandLevel,
        ),
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    this.store = {
      storeState: {
        expandedPaths: getExpandedPaths(
          nextProps.data,
          nextProps.dataIterator,
          nextProps.expandPaths,
          nextProps.expandLevel,
          this.store.storeState.expandedPaths,
        ),
      },
    };
  }

  getChildContext() {
    return {
      store: this.store,
    };
  }

  static childContextTypes = {
    store: PropTypes.any,
  };

  render() {
    const { name, data, dataIterator } = this.props;
    const { nodeRenderer } = this.props;

    const rootPath = DEFAULT_ROOT_PATH;

    return (
      <ConnectedTreeNode
        name={name}
        data={data}
        dataIterator={dataIterator}
        depth={0}
        path={rootPath}
        nodeRenderer={nodeRenderer}
      />
    );
  }
}

TreeView.propTypes = {
  name: PropTypes.string,
  data: PropTypes.any,
  dataIterator: PropTypes.func,
  nodeRenderer: PropTypes.func,
};

TreeView.defaultProps = {
  name: undefined,
};

export default TreeView;