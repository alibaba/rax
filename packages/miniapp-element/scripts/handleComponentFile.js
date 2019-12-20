import fs from 'fs-extra';
import path from 'path';
import generateTemplate from './generateTemplate';
import adapter from './adapter';

export default function(platform) {
  const distPath = path.resolve('dist', platform);
  fs.ensureDirSync(distPath);
  // Copy index file
  fs.copySync(path.resolve('src', `index.${adapter[platform].xml}`), path.join(distPath, `index.${adapter[platform].xml}`));
  fs.copySync(path.resolve('src', 'index.json'), path.join(distPath, 'index.json'));
  // Generate custom component file
  const customPath = path.resolve(distPath, 'custom-component');
  fs.ensureDirSync(customPath);
  fs.writeFileSync(path.join(customPath, 'index.js'), 'Component({});');
  fs.writeFileSync(path.join(customPath, 'index.json'), '{ "component": true }');
  fs.writeFileSync(path.join(customPath, `index.${adapter[platform].xml}`), '<slot></slot>');
  generateTemplate(distPath, platform);
}
