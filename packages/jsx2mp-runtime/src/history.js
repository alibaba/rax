/* global getCurrentPages, PROPS */
// eslint-disable-next-line import/no-extraneous-dependencies
import { isQuickApp } from 'universal-env';
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
    if (isQuickApp) {
      const router = require('@system.router');
      return router.getLength();
    } else {
      return getCurrentPages().length;
    }
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

  __updatePageId(pageId) {
    this._pageId = pageId;
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
    if (isQuickApp) {
      const router = require('@system.router');
      const path = router.getState().path;
      return addLeadingSlash(path);
    } else {
      const pages = getCurrentPages();
      if (pages.length === 0) return '';
      const currentPage = pages[pages.length - 1];
      return addLeadingSlash(currentPage.route);
    }
  }
}

function addLeadingSlash(str) {
  return str[0] === '/' ? str : '/' + str;
}
