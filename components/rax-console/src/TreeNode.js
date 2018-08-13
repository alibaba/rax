import { createElement, Component, PropTypes, Children } from 'rax';

const styles = {
  treeNodeBase: {
    color: 'black',
    cursor: 'default',
    boxSizing: 'border-box',
    // marginRight: '5px',
    fontFamily: 'Menlo, monospace',
  },
  treeNodePreviewContainer: {},
  treeNodePlaceholder: {
    whiteSpace: 'pre',
    fontSize: '12px',
    marginRight: '3px',
  },
  treeNodeArrow: {
    base: {
      color: '#6e6e6e',
      display: 'inline-block',
      // lineHeight: '14px',
      fontSize: '12px',
      marginRight: '3px',
    },
    expanded: {
      WebkitTransform: 'rotateZ(90deg)',
      MozTransform: 'rotateZ(90deg)',
      transform: 'rotateZ(90deg)',
    },
    collapsed: {
      WebkitTransform: 'rotateZ(0deg)',
      MozTransform: 'rotateZ(0deg)',
      transform: 'rotateZ(0deg)',
    },
  },
  treeNodeChildNodesContainer: {
    margin: 0, // reset user-agent style
    paddingLeft: '12px',
  },
};

const Arrow = ({ expanded, styles }) =>
  <span style={{ ...styles.base, ...expanded ? styles.expanded : styles.collapsed }}>▶</span>;

class TreeNode extends Component {
  render() {
    const {
      expanded,
      onClick,
      children,
      nodeRenderer,
      title,
      shouldShowArrow,
      shouldShowPlaceholder,
    } = this.props;

    const renderedNode = createElement(nodeRenderer, this.props);
    const childNodes = expanded ? children : undefined;

    return (
      <div aria-expanded={expanded} role="treeitem" style={styles.treeNodeBase} title={title}>
        <div style={styles.treeNodePreviewContainer} onClick={onClick}>
          {shouldShowArrow || Children.count(children) > 0
            ? <Arrow expanded={expanded} styles={styles.treeNodeArrow} />
            : shouldShowPlaceholder && <span style={styles.treeNodePlaceholder}>&nbsp;</span>}
          {renderedNode}
        </div>

        <ol role="group" style={styles.treeNodeChildNodesContainer}>
          {childNodes}
        </ol>
      </div>
    );
  }
}

TreeNode.propTypes = {
  name: PropTypes.string,
  data: PropTypes.any,
  expanded: PropTypes.bool,
  shouldShowArrow: PropTypes.bool,
  shouldShowPlaceholder: PropTypes.bool,
  nodeRenderer: PropTypes.func,
  onClick: PropTypes.func,
};

TreeNode.defaultProps = {
  name: undefined,
  data: undefined,
  expanded: true,

  nodeRenderer: ({ name }) =>
    <span>
      {name}
    </span>,

  onClick: () => {},

  shouldShowArrow: false,
  shouldShowPlaceholder: true,
};

export default TreeNode;