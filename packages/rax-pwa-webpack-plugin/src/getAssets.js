const getAssets = (compilation) => {
  const compilationHash = compilation.hash;
  const entryNames = Array.from(compilation.entrypoints.keys());
  let publicPath = compilation.mainTemplate.getPublicPath({ hash: compilationHash });

  if (publicPath.length && publicPath.substr(-1, 1) !== '/') {
    publicPath += '/';
  }

  const assets = {
    publicPath: publicPath,
    js: [],
    css: [],
  };

  // Extract paths to .js, and .css files from the current compilation
  const entryPointPublicPathMap = {};
  const extensionRegexp = /\.(css|js)(\?|$)/;

  for (let i = 0; i < entryNames.length; i++) {
    const entryName = entryNames[i];
    const entryPointFiles = compilation.entrypoints.get(entryName).getFiles();

    // Prepend the publicPath and append the hash depending on the
    const entryPointPublicPaths = entryPointFiles
      .map(chunkFile => {
        const entryPointPublicPath = publicPath + chunkFile;
        return entryPointPublicPath;
      });

    entryPointPublicPaths.forEach((entryPointPublicPath) => {
      const extMatch = extensionRegexp.exec(entryPointPublicPath);
      // Skip if the public path is not a .css, .js file
      if (!extMatch) {
        return;
      }
      // Skip if this file is already known
      if (entryPointPublicPathMap[entryPointPublicPath]) {
        return;
      }

      entryPointPublicPathMap[entryPointPublicPath] = true;
      assets[extMatch[1]].push(entryPointPublicPath);
    });
  }
  return assets;
};

module.exports = getAssets;
