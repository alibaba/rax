import Host from './host';
import EmptyComponent from './empty';
import NativeComponent from './native';
import TextComponent from './text';
import CompositeComponent from './composite';
import FragmentComponent from './fragment';
import reconciler from '../devtools/reconciler';
import { invokeMinifiedError } from '../error';

export default function inject({ driver, measurer }) {
  // Inject component class
  Host.Empty = EmptyComponent;
  Host.Native = NativeComponent;
  Host.Text = TextComponent;
  Host.Fragment = FragmentComponent;
  Host.Composite = CompositeComponent;

  // Inject render driver
  if (!(Host.driver = driver || Host.driver)) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error('Driver not found.');
    } else {
      invokeMinifiedError(5);
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    // Inject devtool renderer hook
    Host.reconciler = reconciler;

    // Inject performance measurer
    Host.measurer = measurer;
  }
}
