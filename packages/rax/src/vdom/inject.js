import Host from './host';
import EmptyComponent from './empty';
import NativeComponent from './native';
import TextComponent from './text';
import CompositeComponent from './composite';
import FragmentComponent from './fragment';
import Hook from '../debug/hook';

export default function inject({ driver, hook, measurer }) {
  // Inject component class
  Host.EmptyComponent = EmptyComponent;
  Host.NativeComponent = NativeComponent;
  Host.TextComponent = TextComponent;
  Host.FragmentComponent = FragmentComponent;
  Host.CompositeComponent = CompositeComponent;

  // Inject devtool hook
  Host.hook = hook || Hook;

  // Inject performance measurer
  Host.measurer = measurer;

  // Inject render driver
  Host.driver = driver || Host.driver;

  if (!Host.driver) {
    throw Error('Driver not found.');
  }
}
