import fs from 'fs-extra';
import path from 'path';
import generateSubtree from './genreateSubtree';
import adapter from './adapter';

export default function(platform) {
  const distPath = path.resolve('dist', platform);
  fs.ensureDirSync(distPath);

  // Copy index file
  const sourceIndexXMLFilePath = path.resolve('src', 'templates', `index.${adapter[platform].xml}`);
  const distIndexXMLFilePath = path.join(distPath, `index.${adapter[platform].xml}`);
  const sourceIndexJSONFilePath = path.resolve('src', `index.${platform}.json`);
  const distIndexJSONFilePath = path.join(distPath, 'index.json');
  fs.copySync(sourceIndexXMLFilePath, distIndexXMLFilePath);
  fs.copySync(sourceIndexJSONFilePath, distIndexJSONFilePath);

  // Generate custom component file
  const customComponentPath = path.resolve(distPath, 'custom-component');
  fs.ensureDirSync(customComponentPath);
  fs.writeFileSync(path.join(customComponentPath, 'index.js'), 'Component({});');
  fs.writeFileSync(path.join(customComponentPath, 'index.json'), '{ "component": true }');
  fs.writeFileSync(path.join(customComponentPath, `index.${adapter[platform].xml}`), '<slot></slot>');

  generateSubtree(distPath, platform);
}
