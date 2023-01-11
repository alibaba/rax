import Host from './host';
import NativeComponent from './native';
import CompositeComponent from './composite';
import TextComponent from './text';
import FragmentComponent from './fragment';
import EmptyComponent from './empty';
import reconciler from '../devtools/reconciler';

export default function inject() {
  // Inject component class
  Host.__Empty = EmptyComponent;
  Host.__Native = NativeComponent;
  Host.__Text = TextComponent;
  Host.__Fragment = FragmentComponent;
  Host.__Composite = CompositeComponent;

  if (process.env.NODE_ENV !== 'production') {
    // Inject devtool renderer hook
    Host.reconciler = reconciler;
  }
}
