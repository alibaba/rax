import { definePluginPage } from './page';
import { definePluginComponent, getPluginComponent } from './component';
import { definePluginAPI, getPluginAPI } from './API';

function getPluginPart(type, path) {
  switch (type) {
    case 'component': {
      return getPluginComponent(path);
    }
    case 'api': {
      return getPluginAPI(path);
    }
  }
  return null;
}

export {
  getPluginPart,
  definePluginPage,
  definePluginComponent,
  definePluginAPI
};
