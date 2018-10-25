const path = require('path');

const ComponentEmiter = require('./ComponentEmiter');
const { OUTPUT_SOURCE_FOLDER, OUTPUT_VENDOR_FOLDER } = require('../../config/CONSTANTS');

const PageGenerator = class PageGenerator {
  constructor(loaderContext) {
    this.loaderContext = loaderContext;
    this.emiter = new ComponentEmiter(loaderContext);
  }

  init(rootContentsNode) {
    this.rootContentsNode = rootContentsNode;
  }

  emitChildren(note = {}) {
    if (Array.isArray(note.children)) {
      note.children.forEach((childrenNote) => {
        const { originPath, outputPath, templateName, dependencyMap, files } = childrenNote;
        files.forEach((file) => {
          this.emitFile({ originPath, outputPath, templateName, dependencyMap, file });
        });
        this.emitChildren(childrenNote);
      });
    }
  }

  emitPage() {
    const { originPath, outputPath, dependencyMap, files } = this.rootContentsNode;
    files.forEach((file) => {
      this.emitFile({ originPath, outputPath, dependencyMap, file }, 'page');
    });

    this.emitChildren(this.rootContentsNode);
  }

  emitFile({ originPath, outputPath, templateName, dependencyMap, file }, sfcType = 'component') {
    const isPage = sfcType == 'page';
    const filepath = isPage ? originPath : outputPath;
    this.loaderContext.addDependency(originPath);
    if (file.type === 'style') {
      this.emiter.emitStyle({ filepath, contents: file.contents, dependencyMap: dependencyMap });
    } else if (file.type === 'template') {
      this.emiter.emitTemplate({
        filepath,
        contents: file.contents,
        templateName,
        registyTemplate: sfcType == 'component',
        dependencyMap: dependencyMap,
      });
    } else if (file.type === 'script') {
      if (sfcType == 'page') {
        const scriptOutputAbsolutePath = path.join(
          this.loaderContext.rootContext,
          OUTPUT_SOURCE_FOLDER,
          path.relative(this.loaderContext.rootContext, originPath)
        );
        this.emiter.emitScript({
          filepath: scriptOutputAbsolutePath,
          contents: file.contents,
        });
      } else {
        this.emiter.emitScript({ filepath, contents: file.contents });
      }
    } else {
      throw new Error(`Unkown contents node type: ${file.type}`);
    }
  }

  getSource() {
    const rootContext = this.loaderContext.rootContext;
    const createPageAbsolutePath = path.join(rootContext, OUTPUT_VENDOR_FOLDER, 'createPage.js');
    const pageOriginFileMate = path.parse(this.loaderContext.resourcePath);
    delete pageOriginFileMate.base;
    const scriptAbsolutePath = path.format({ ...pageOriginFileMate, ext: '.js' });
    const scriptOutputAbsolutePath = path.join(
      rootContext,
      OUTPUT_SOURCE_FOLDER,
      path.relative(rootContext, scriptAbsolutePath)
    );

    const pageRelatedPath = path.relative(path.dirname(scriptAbsolutePath), scriptOutputAbsolutePath);
    const createPageRelatedPath = path.relative(path.dirname(scriptAbsolutePath), createPageAbsolutePath);
    let source = 'Page({});';

    const { templatePropsData, dependencyMap } = this.getPageContextData();

    const deps = Object.keys(dependencyMap)
      .map((tagName) => {
        const { templateName, outputPath } = dependencyMap[tagName];
        const propsData = templatePropsData[templateName] ? JSON.stringify(templatePropsData[templateName]) : '{}';
        const templateRelatedPath = path.relative(path.dirname(this.loaderContext.resourcePath), outputPath);
        const outputPathMate = path.parse(templateRelatedPath);
        delete outputPathMate.base;
        outputPathMate.ext = '.js';
        return `'${templateName}': { config: require('${path.format(outputPathMate)}'), propsData: ${propsData} },`;
      })
      .join('\n');

    source = [
      `var pageConfig = require('${pageRelatedPath}');`,
      `var createPage = require('${createPageRelatedPath}');`,
      `Page(createPage(pageConfig, {${deps}}));`,
    ].join('\n');

    return source;
  }

  getPageContextData() {
    const templatePropsData = {};
    const dependencyMap = {};
    function merge(note) {
      Object.assign(templatePropsData, note.templatePropsData);
      Object.assign(dependencyMap, note.dependencyMap);
      if (note.children) {
        note.children.forEach(merge);
      }
    }
    merge(this.rootContentsNode);
    return { templatePropsData, dependencyMap };
  }
};

module.exports = PageGenerator;
