export default class Location {
  constructor() {
    this._currentPageOptions = {};
    this.hash = '';
  }

  __updatePageOption(pageOptions) {
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
    // eslint-disable-next-line no-undef
    const pages = getCurrentPages();
    if (pages.length === 0) return '';
    const currentPage = pages[pages.length - 1];
    return addLeadingSlash(currentPage.route);
  }
}

function addLeadingSlash(str) {
  return str[0] === '/' ? str : '/' + str;
}
