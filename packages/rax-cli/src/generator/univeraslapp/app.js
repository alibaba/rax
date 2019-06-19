/**
 * App entry.
 */
export default class App {
  /**
   * App config.
   */
  static config = {
    'pages': [
      'pages/home'
    ],
    'window': {
      'defaultTitle': 'MiniApp'
    }
  };

  constructor() {
    console.log('App entry.');
    this.sellerId = 0;
  }

  onLaunch(options) {}
}
