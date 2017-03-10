import {createElement, Component} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import TabBar from 'rax-tabbar';
import Contact from './components/Contact';
import Message from './components/Message';
import Discover from './components/Discover';
import Mine from './components/Mine';
import styles from './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'message'
    };
  }

  selectTab = (tab) => {
    this.setState({
      selectedTab: tab
    });
  }

  _renderContent(Component, title) {
    return (
      <Component title={title} />
    );
  }

  render() {
    const { selectedTab } = this.state;
    return (
      <TabBar fixedPlace="bottom" tintColor="#45b640" barTintColor="#F5F6F8">
        <TabBar.Item
          selected={selectedTab === 'message'}
          title="微信"
          icon={{uri: require('./images/message@3x.png'), scale: 3}}
          selectedIcon={{uri: require('./images/message_fill@3x.png'), scale: 3}}
          onPress={() => this.selectTab('message')}
        >
          { this._renderContent(Message, '微信') }
        </TabBar.Item>
        <TabBar.Item
          onPress={() => this.selectTab('contact')}
          selected={selectedTab === 'contact'}
          title="联系人"
          icon={{uri: require('./images/contact@3x.png'), scale: 3}}
          selectedIcon={{uri: require('./images/contact_fill@3x.png'), scale: 3}}
        >
          { this._renderContent(Contact, '联系人') }
        </TabBar.Item>
        <TabBar.Item
          onPress={() => this.selectTab('discover')}
          title="发现"
          icon={{uri: require('./images/found@3x.png'), scale: 3}}
          selectedIcon={{uri: require('./images/found_fill@3x.png'), scale: 3}}
          selected={selectedTab === 'discover'}
        >
          { this._renderContent(Discover, '发现') }
        </TabBar.Item>
        <TabBar.Item
          title="我"
          onPress={() => this.selectTab('mine')}
          icon={{uri: require('./images/me@3x.png'), scale: 3}}
          selectedIcon={{uri: require('./images/me_fill@3x.png'), scale: 3}}
          selected={selectedTab === 'mine'}
        >
          { this._renderContent(Mine, '我') }
        </TabBar.Item>
      </TabBar>
    );
  }
}

export default App;
