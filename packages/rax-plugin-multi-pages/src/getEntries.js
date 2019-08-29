const path = require('path');
const fs = require('fs-extra');
const { getRouteName } = require('rax-compile-config');

module.exports = (context) => {
  const { rootDir } = context;

  // MPA
  let routes = [];

  try {
    routes = fs.readJsonSync(path.resolve(rootDir, 'src/app.json')).routes;
  } catch (e) {
    console.error(e);
    throw new Error('routes in app.json must be array');
  }

  return routes.map((route) => {
    const entryName = getRouteName(route, rootDir);

    return {
      entryName,
      ...route
    };
  });
};
