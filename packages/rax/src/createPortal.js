import Component from './component';
import render from './render';
import unmountComponentAtNode from './unmountComponentAtNode';
import createElement from './createElement';

class Portal extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    this.renderPortal();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.container !== this.props.container) {
      unmountComponentAtNode(prevProps.container);
    }

    this.renderPortal();
  }

  componentWillUnmount() {
    unmountComponentAtNode(this.props.container);
  }

  renderPortal() {
    render(this.props.element, this.props.container, {
      parent: this
    });
  }

  render() {
    return null;
  }
}

export default function createPortal(element, container) {
  return createElement(Portal, {
    element,
    container,
  });
}
