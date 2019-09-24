/* global getCurrentPages, PROPS */
import { push, replace, go, goBack, canGo, goForward } from './router';

export function createMiniAppHistory() {
  const defaultActions = {
    push,
    replace,
    goBack,
    go,
    canGo,
    goForward,
  };
  return Object.assign(new MiniAppHistory(), defaultActions);
}

class MiniAppHistory {
  constructor() {
    this.location = new Location();
  }
  get length() {
    return getCurrentPages().length;
  }
}

class Location {
  constructor() {
    this._options = {};
  }

  __updatePageOption(options) {
    this._options = options;
  }

  get search() {
    let search = '';
    Object.keys(this._options).map((key, index) => {
      const query = `${key}=${this._options[key]}`;
      if (index === 0) {
        search += `?${query}`;
      } else {
        search += `&${query}`;
      }
    });
    return search;
  }

  get hash() {
    return null;
  }

  get pathname() {
    return getCurrentPageUrl();
  }
}

function getCurrentPageUrl() {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  return addLeadingSlash(currentPage.route);
}

function addLeadingSlash(str) {
  return str[0] === '/' ? str : '/' + str;
}
