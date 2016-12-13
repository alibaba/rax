import cons from 'consolidate';
import path from 'path';
import loaderUtils from 'loader-utils';
import HTMLtoJSX from './HTMLtoJSX';
import { transform } from 'babel-core';
import { parserWithStatement } from './utils';
const converter = new HTMLtoJSX();

module.exports = function(source, parseObject) {
  this.cacheable && this.cacheable();
  const callback = this.async();
  const query = loaderUtils.parseQuery(this.query);
  const projectName = query.project || 'react';
  const project = projects[projectName];

  // no engine default: html
  if (!cons[query.engine]) {
    return callback(null, getConvertText(source, project, parseObject.importLinks));
  }

  cons[query.engine].render(source, {
    filename: this.resourcePath
  }, (error, html) => {
    return callback(error, getConvertText(html, project, parseObject.importLinks));
  });
};

const getConvertText = (source, project, links) => {
  const convert = converter.convert(source);
  const code = `
    ${getDefaultPackages(project.defaultPackages, project)}
    ${getElementsImport(links)}
    module.exports = {
      render: function(props, context, styles) {
        return (${convert.output})
      }
    };
  `;

  return transform(code, {presets: project.presets}).code;
};

let projects = {
  react: {
    name: 'react',
    defaultPackages: [],
    presets: ['es2015', 'react']
  },

  rax: {
    name: 'rax',
    defaultPackages: [],
    presets: ['es2015', 'rax']
  }
};

const getDefaultPackages = (packages = '', project) => {
  const {name} = project;
  let importText = '';

  if (name === 'react') {
    importText += 'import React from \'react\';\n';
  } else {
    importText += `import {createElement, Component} from '${project.name}';\n`;
  }

  packages.forEach((packageName) => {
    const nameFrom = packageName.split(':');

    importText += `import ${nameFrom[0]} from '${nameFrom[1]}';\n`;
  });

  return importText;
};

const getElementsImport = (links) => {
  let result = '';

  links.forEach((link) => {
    const ext = path.extname(link);
    const name = path.basename(link, ext);
    result += `import ${name} from '${link}';\n`;
  });

  return result;
};
