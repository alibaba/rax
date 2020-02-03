// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp } from 'universal-env';

export default function(Klass) {
  // For alibaba miniapp
  if (isMiniApp) {
    return Klass.__config.events;
  } else {
    return Klass.__config;
  }
}
