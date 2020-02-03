// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp } from 'universal-env';

export default function(Klass, returnConfig) {
  // For alibaba miniapp
  if (isMiniApp) {
    return returnConfig ? Klass.__config : Klass.__config.events;
  } else {
    return Klass.__config;
  }
}
