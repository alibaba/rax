// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp } from 'universal-env';
import dutyChain from './dutyChain';

export default function(Klass) {
  function handleMiniApp() {
    if (isMiniApp) {
      return Klass.__config.events;
    } else return null;
  }

  function handleDefault() {
    return Klass.__config;
  }

  return dutyChain(handleMiniApp, handleDefault);
}
