import {Component, createElement} from 'rax';
import View from 'rax-view';

class Col extends Component {
  render() {
    let {
      children,
      style,
    } = this.props;

    return (
      <View
        {...this.props}
        style={{
          flex: 1,
          ...style,
          width: '1%',
        }}
      />
    );
  }
}

export default Col;
