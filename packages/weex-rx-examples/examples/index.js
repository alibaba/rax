import {createElement, Component, render} from 'universal-rx';

function getBaseURL(dir) {
  var bundleUrl = document.URL;
  var nativeBase;
  var isAndroidAssets = bundleUrl.indexOf('your_current_IP') >= 0 || bundleUrl.indexOf('file://assets/')>=0;
  var isiOSAssets = bundleUrl.indexOf('file:///') >= 0 && bundleUrl.indexOf('WeexDemo.app') > 0;
  if (isAndroidAssets) {
    nativeBase = 'file://assets/';
  }
  else if (isiOSAssets) {
    // file:///var/mobile/Containers/Bundle/Application/{id}/WeexDemo.app/
    // file:///Users/{user}/Library/Developer/CoreSimulator/Devices/{id}/data/Containers/Bundle/Application/{id}/WeexDemo.app/
    nativeBase = bundleUrl.substring(0, bundleUrl.lastIndexOf('/') + 1);
  }
  else {
    var host = 'localhost:12580';
    var matches = /\/\/([^\/]+?)\//.exec(bundleUrl);
    if (matches && matches.length >= 2) {
      host = matches[1];
    }
    nativeBase = 'http://' + host + '/' + dir + '/build/';
  }
  var h5Base = './index.html?page=./' + dir + '/build/';
  // in Native
  var base = nativeBase;
  if (typeof window === 'object') {
    // in Browser or WebView
    base = h5Base;
  }
  return base
}

const EXAMPLES = [
  // common
  {name: '/syntax/hello-world', title: 'Hello World'},
  {name: '/style/index', title: 'Common Style'},
  // component
  {name: '/components/text', title: 'Text'},
  {name: '/components/image', title: 'Image'},
  {name: '/components/input', title: 'Input'},
  {name: '/components/scroller', title: 'Scroller'},
  {name: '/components/list', title: 'List'},
  {name: '/components/slider', title: 'Slider'},
  {name: '/components/a', title: 'A'},
  {name: '/components/video', title: 'Video'},
  {name: '/components/countdown', title: 'Countdown'},
  {name: '/components/marquee', title: 'Marquee'},
  {name: '/components/web', title: 'Web'},
  {name: '/components/navigator', title: 'Navigator'},
  {name: '/components/tabbar', title: 'Tabbar'},
  // module
  {name: '/modules/modal', title: 'Modal'},
  {name: '/modules/stream', title: 'Stream'},
  {name: '/modules/storage',title:'Storage'},
  {name: '/modules/animation', title: 'Animation'},
  // {name: 'module/clipboard', title: 'Clipboard'}, // 0.8 , developing
];

class ExampleItem extends Component {
  handleClick = () => {
    let event = require('@weex-module/event');
    let url = this.props.url;
    if (!url) {
      var base = getBaseURL('examples');
      url = base + this.props.name + '.js';
    }
    event.openURL(url);
  };

  render() {
    return (
      <cell append="tree">
        <div style={styles.item} onClick={this.handleClick}>
          <text style={styles.itemText}>
            {this.props.title}
          </text>
        </div>
      </cell>
    )
  }
}

class Examples extends Component {
  render() {
    return (
      <list>
        {EXAMPLES.map((item)=>{
          return <ExampleItem title={item.title} name={item.name} url={item.url} />
        })}
      </list>
    );
  }
}

const styles = {
  item: {
    paddingTop: 25,
    paddingBottom: 25,
    paddingLeft: 35,
    paddingRight: 35,
    height: 160,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: '#dddddd',
    backgroundColor: '#ffffff'
  },
  itemText: {
    fontSize: 48,
    color: '#555555'
  }
}

render(<Examples />);
