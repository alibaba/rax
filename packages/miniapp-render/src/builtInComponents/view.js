// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp } from 'universal-env';

const view = {
  name: 'view'
};

if (isMiniApp) {
  view.simpleEvents = [{
    name: 'onViewAppear',
    eventName: 'appear'
  },
  {
    name: 'onViewFirstAppear',
    eventName: 'firstappear'
  },
  {
    name: 'onViewDisappear',
    eventName: 'disappear'
  }];
}

export default view;
