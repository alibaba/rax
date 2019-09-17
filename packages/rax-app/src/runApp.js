import runWebApp from './runApp.web';
import runWeexApp from './runApp.weex';
import { isWeex, isWeb } from 'universal-env';

export default function runApp(config) {
  if (isWeb) {
    runWebApp(config);
  } else if (isWeex) {
    runWeexApp(config);
  }
}