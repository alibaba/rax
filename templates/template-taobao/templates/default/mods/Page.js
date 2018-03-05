import {PureComponent, createElement} from 'rax';
import View from 'rax-view';

const PAGE_ID = 'rax-page';

class Page extends PureComponent {
  render() {
    let style = {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...this.props.style,
    };

    return (
      <View {...this.props} style={style}>
        {this.props.children}
      </View>
    );
  }
}

export default Page;
