import { createElement, Component } from 'rax';
import HeaderBar from './HeaderBar';
import TabBar from './TabBar';
import Client, { createClient } from './Client';
import resolvePathname from 'resolve-pathname';
import qs from 'querystring';
import {warn} from '../../../core/debugger';

function isURL(str) {
  return /^([\w\d]+:)\/\//.test(str);
}

const ROUTE_HASH_PREFIX = '!/';
const ROUTE_HASH_REG = /^#?!\//;

export default class AppShell extends Component {

  static getInitialPageName(appConfig) {
    const hashRoute = location.hash.replace(ROUTE_HASH_REG, '');
    if (hashRoute !== '') {
      return hashRoute;
    }

    if (appConfig.hasOwnProperty('homepage')) {
      return appConfig.homepage;
    }

    return Object.keys(appConfig.pages)[0];
  }

  constructor(props) {
    super();

    const client = createClient(AppShell.getInitialPageName(props.config));
    this.state = {
      currentPageName: client.pageName,
      currentClientId: client.clientId,
      routeStack: [client],
    };

    this.initialPageName = client.pageName;
  }

  push(pageName) {
    const { currentPageName } = this.state;
    if (isURL(pageName)) {
      return location.href = pageName;
    }

    // Compatible with absolute page path.
    if (pageName[0] === '/') {
      pageName = pageName.slice(1);
    }

    // Compatible with relative page path.
    if (pageName[0] === '.') {
      pageName = resolvePathname(pageName, currentPageName);
    }

    // Change the url hash.
    location.hash = ROUTE_HASH_PREFIX + pageName;

    let pageQuery;
    if (/\?/.test(pageName)) {
      let queryString;
      [pageName, queryString] = pageName.split('?');
      pageQuery = qs.parse(queryString);
    }

    const client = createClient(pageName, pageQuery);
    this.setState({
      routeStack: [...this.state.routeStack, client],
      currentClientId: client.clientId,
      currentPageName: client.pageName,
    });
  }

  /**
   * Handle navigate from worker.
   */
  onRoute = (data) => {
    const { navigateTo, navigateType } = data;
    switch (navigateType) {
      case 'navigate':
        this.push(navigateTo);
        break;

      case 'redirect':
        this.redirect(navigateTo);
        break;

      case 'switchTab':
        this.switchTab(navigateTo);
        break;

      case 'navigateBack':
        this.navigateBack();
        break;

      default:
        warn('Unknown navigate type', data);
    }
  }

  /**
   * Navigate to another page.
   * @param pageName
   */
  changeCurrentPage = (pageName) => {
    this.setState({ currentPageName: pageName });
  };

  /**
   * Navigate to perv page.
   */
  prev = () => {
    // todo: prev page
  };

  renderClients() {
    const { currentPageName, routeStack } = this.state;
    return routeStack.map((client) => <Client
      {...client}
      key={client.clientId}
      active={currentPageName === client.pageName}
    />);
  }

  render() {
    const { config } = this.props;
    const { currentPageName } = this.state;

    return [
      <HeaderBar
        appWindow={config.window}
        onPrev={this.prev}
        showPrev={this.initialPageName !== currentPageName}
      />,
      <div id="main" style={styles.main} data-main>{this.renderClients()}</div>,
      <TabBar
        tabBarList={config.tabBar.list}
        currentPageName={currentPageName}
        changeCurrentPage={this.changeCurrentPage}
      />
    ];
  }
}

const styles = {
  main: {
    display: 'flex',
    position: 'absolute',
    top: 75,
    bottom: 97,
    left: 0,
    right: 0,
    margin: 0,
    background: '#f4f4f4',
  },
};
