import Host from './host';
import EmptyComponent from './empty';
import NativeComponent from './native';
import TextComponent from './text';
import CompositeComponent from './composite';
import FragmentComponent from './fragment';
import reconciler from '../devtools/reconciler';
import { throwError, throwMinifiedError } from '../error';

export default function inject({ driver, measurer }) {
  // Inject component class
  Host.__Empty = EmptyComponent;
  Host.__Native = NativeComponent;
  Host.__Text = TextComponent;
  Host.__Fragment = FragmentComponent;
  Host.__Composite = CompositeComponent;

  // Inject render driver
  if (!(Host.driver = driver || Host.driver)) {
    if (process.env.NODE_ENV !== 'production') {
      throwError('Rax driver not found.');
    } else {
      throwMinifiedError(5);
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    // Inject devtool renderer hook
    Host.reconciler = reconciler;

    // Inject performance measurer
    Host.measurer = measurer;
  }
}
