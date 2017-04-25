import {Component, createElement} from 'rax';
import View from 'rax-view';

class Header extends Component {
  render() {
    let props = this.props;
    return <View {...this.props} style={{...styles.header, ...props.style}} />;
  }
}
class Content extends Component {
  render() {
    let props = this.props;
    return <View {...this.props} style={{...styles.content, ...props.style}} />;
  }
}
class Footer extends Component {
  render() {
    let props = this.props;
    return <View {...this.props} style={{...styles.footer, ...props.style}} />;
  }
}
class Card extends Component {
  render() {
    let props = this.props;
    return <View {...props} style={{...styles.container, ...props.style}} />;
  }
}

Card.Header = Header;
Card.Content = Content;
Card.Footer = Footer;

let styles = {
  container: {
    width: 750,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#efefef',
    borderBottomStyle: 'solid',
  },
  content: {
    padding: 30,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#efefef',
    borderTopStyle: 'solid',
    padding: 30,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
};

export default Card;
