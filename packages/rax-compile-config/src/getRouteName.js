const path = require('path');
const fs = require('fs-extra');

module.exports = (route, rootDir) => {
  if (route.name) {
    return route.name;
  }

  const appConfig = fs.readJsonSync(path.resolve(rootDir, 'src/app.json'));

  const routeName = appConfig.routeName ? appConfig.routeName : 'path';

  if (routeName === 'path') {
    return route.component.replace(/\//g, '_');
  }

  if (routeName === 'directory') {
    console.log(path.dirname(route.component));
    return path.dirname(route.component);
  }
};
