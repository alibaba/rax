import Host from './host';
import EmptyComponent from './empty';
import NativeComponent from './native';
import TextComponent from './text';
import CompositeComponent from './composite';
import FragmentComponent from './fragment';

export default function injectComponent() {
  // Inject component class
  Host.EmptyComponent = EmptyComponent;
  Host.NativeComponent = NativeComponent;
  Host.TextComponent = TextComponent;
  Host.FragmentComponent = FragmentComponent;
  Host.CompositeComponent = CompositeComponent;
}
