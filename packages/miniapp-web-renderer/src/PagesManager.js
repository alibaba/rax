class PageManager {
  constructor(pages) {
    this.pages = pages;
  }

  getPageFilepathByPathname(pathname) {
    return this.pages[pathname.replace(/^\//, '')];
  }

  getPageNameFromFilepath(filepath) {
    filepath = filepath.replace(/^\//, '');
    let resultPageName = filepath;
    Object.keys(this.pages).forEach((pageName) => {
      if (filepath == this.pages[pageName]) {
        resultPageName = pageName;
      }
    });
    return resultPageName;
  }
}

export default PageManager;
