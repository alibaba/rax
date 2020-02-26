// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp } from 'universal-env';

export default function(Klass, shouldReturnConfig) {
  // For alibaba miniapp
  if (isMiniApp) {
    return shouldReturnConfig ? Klass.__config : Klass.__config.events;
  } else {
    return Klass.__config;
  }
}
