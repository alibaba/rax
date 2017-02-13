import instance from './vdom/instance';
import {DebugTool} from 'universal-perf';

export default function unmountComponentAtNode(node) {
  let component = instance.get(node);

  if (!component) {
    return false;
  }

  instance.remove(node);
  component._internal.unmountComponent();

  if (process.env.NODE_ENV !== 'production') {
    DebugTool.onEndFlush();
  }

  return true;
};
