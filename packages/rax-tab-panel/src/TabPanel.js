import {createElement, Component} from 'rax';
import View from 'rax-view';

const styles = {
  pageContainer: {
    flex: 1,
    width: 750,
    backgroundColor: '#EEE'
  }
};


class TabPanel extends Component {
  state = {
    isAppear: false,
  }

  show = () => {
    this.setState({isAppear: true});
  }

  hide = () => {
    this.setState({isAppear: false});
  }


  render() {
    return (<View {...this.props} style={[styles.pageContainer, this.props.style]}>
      {this.state.isAppear ? this.props.children : null}
    </View>);
  }
}

export default TabPanel;