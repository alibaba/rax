import Host from './vdom/host';
import WeexDriver from './drivers/weex';
import BrowserDriver from './drivers/browser';
import {isWeb, isWeex} from 'universal-env';

export const setDriver = (driver) => {
  Host.driver = driver;
};

export const getDriver = () => {
  return Host.driver;
};

export const injectDriver = () => {
  let driver = getDriver();

  // Inject driver
  if (!driver) {
    if (isWeex) {
      driver = WeexDriver;
    } else if (isWeb) {
      driver = BrowserDriver;
    } else {
      throw Error('No builtin driver matched');
    }

    setDriver(driver);
  }
};
