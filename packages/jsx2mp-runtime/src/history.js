/* global getCurrentPages, PROPS */
import { push, replace, go, goBack, canGo, goForward } from './router';

export function createMiniAppHistory() {
  return new MiniAppHistory();
}

class MiniAppHistory {
  constructor() {
    this.location = new Location();

    // Apply actions for history.
    Object.assign(this, { push, replace, goBack, go, canGo, goForward });
  }

  get length() {
    return getCurrentPages().length;
  }
}

class Location {
  constructor() {
    this._currentPageOptions = {};
    this.hash = '';
  }

  __updatePageOption(pageOptions) {
    this._currentPageOptions = pageOptions;
  }

  get search() {
    let search = '';
    Object.keys(this._currentPageOptions).forEach((key, index) => {
      const query = `${key}=${this._currentPageOptions[key]}`;
      search += index === 0 ? '?' : '&';
      search += query;
    });
    return search;
  }

  get pathname() {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    return addLeadingSlash(currentPage.route);
  }
}

function addLeadingSlash(str) {
  return str[0] === '/' ? str : '/' + str;
}
