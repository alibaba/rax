/* global getCurrentPages, PROPS */
import { push, replace, go, goBack, canGo, goForward } from './router';

let history;

export function createMiniAppHistory() {
  if (history) return history;
  return history = new MiniAppHistory();
}

export function getMiniAppHistory() {
  return history;
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

  __updatePageOption(pageId, pageOptions) {
    this._pageId = pageId;
    this._currentPageOptions = pageOptions;
  }

  get href() {
    return this.pathname + this.search;
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
    if (pages.length === 0) return '';
    const currentPage = pages[pages.length - 1];
    return addLeadingSlash(currentPage.route);
  }
}

function addLeadingSlash(str) {
  return str[0] === '/' ? str : '/' + str;
}
