import { isWeb, isWeex } from 'universal-env';
import Host from './vdom/host';
import EmptyComponent from './vdom/empty';
import NativeComponent from './vdom/native';
import TextComponent from './vdom/text';
import CompositeComponent from './vdom/composite';
import FragmentComponent from './vdom/fragment';
import WeexDriver from 'driver-weex';
import BrowserDriver from 'driver-browser';
import Hook from './debug/hook';

export default function inject({ driver, hook, measurer, deviceWidth, viewportWidth, eventRegistry, bodyType, bodyProps}) {
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
  if (!Host.driver) {
    if (!driver) {
      if (isWeex) {
        driver = WeexDriver;
      } else if (isWeb) {
        driver = BrowserDriver;
      } else {
        throw Error('No builtin driver matched');
      }
    }
    Host.driver = driver;
  }

  if (deviceWidth && Host.driver.setDeviceWidth) {
    Host.driver.setDeviceWidth(deviceWidth);
  }

  if (viewportWidth && Host.driver.setViewportWidth) {
    Host.driver.setViewportWidth(viewportWidth);
  }

  if (eventRegistry) {
    Host.driver.eventRegistry = eventRegistry;
  }

  // Body custom type only works in weex
  if (bodyType) {
    Host.driver.bodyType = bodyType;
  }

  if (bodyProps) {
    Host.driver.bodyProps = bodyProps;
  }
}
