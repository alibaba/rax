import path from 'path';
import findRoot from 'find-root';
import {ConcatSource} from 'webpack-sources';

function cleanPath(path) {
  return path.split('/node_modules/').join('/~/');
}

// Get closest package definition from path
function getClosestPackage(modulePath) {
  var root;
  var pkg;

  // Catch findRoot or require errors
  try {
    root = findRoot(modulePath);
    pkg = require(path.join(root, 'package.json'));
  } catch (e) {
    return null;
  }

  // If the package.json does not have a name property, try again from
  // one level higher.
  // https://github.com/jsdnxx/find-root/issues/2
  // https://github.com/date-fns/date-fns/issues/264#issuecomment-265128399
  if (!pkg.name) {
    return getClosestPackage(path.resolve(root, '..'));
  }

  return {
    package: pkg,
    path: root
  };
}

function check(compilation, modulesToCheck) {
  var context = compilation.compiler.context;
  var modules = {};

  function cleanPathRelativeToContext(modulePath) {
    var cleanedPath = cleanPath(modulePath);

    // Make relative to compilation context
    if (cleanedPath.indexOf(context) === 0) {
      cleanedPath = '.' + cleanedPath.replace(context, '');
    }

    return cleanedPath;
  }

  compilation.modules.forEach(module => {
    if (!module.resource) {
      return;
    }

    var pkg;
    var packagePath;

    var closestPackage = getClosestPackage(module.resource);

    // Skip module if no closest package is found
    if (!closestPackage) {
      return;
    }

    pkg = closestPackage.package;
    packagePath = closestPackage.path;

    var modulePath = cleanPathRelativeToContext(packagePath);

    var version = pkg.version;

    if (modulesToCheck.indexOf(pkg.name) < 0) {
      return;
    }

    modules[pkg.name] = modules[pkg.name] || [];

    var isSeen = false;

    modules[pkg.name].forEach(module => {
      if (module.version === version) {
        isSeen = true;
      }
    });

    if (!isSeen) {
      var entry = { version, path: modulePath };

      modules[pkg.name].push(entry);
    }
  });

  var duplicates = {};
  Object.keys(modules).forEach((name) => {
    if (modules[name].length > 1) {
      duplicates[name] = modules[name];
    }
  });

  return duplicates;
}

function formatMsg(duplicates) {
  var error = 'Duplicate (conflicting) packages loaded, make sure to use only one: ';

  if (Object.keys(duplicates).length) {
    Object.keys(duplicates).forEach((key) => {
      var instances = duplicates[key];
      instances = instances.map(version => {
        var str = `${version.version} ${version.path}`;
        return str;
      });
      error += '\\n  <' + key + '> \\n';
      error += '    ' + instances.join('\\n    ') + '\\n';
    });
  }

  return error;
}

export default class DuplicateChecker {
  constructor(options) {
    this.options = Object.assign({}, options); ;
  }

  apply(compiler) {
    const modulesToCheck = this.options.modulesToCheck;
    if (!modulesToCheck || !modulesToCheck.length) {
      return;
    }

    // Webpack 4
    if (compiler.hooks && compiler.hooks.compilation && compiler.hooks.compilation.tap) {
      compiler.hooks.compilation.tap('RaxDuplicateCheckerPlugin', compilation => {
        const duplicates = check(compilation, modulesToCheck);
        if (!Object.keys(duplicates).length) {
          return;
        }

        const errorMessages = `console.error('${formatMsg(duplicates)}');`;

        compilation.hooks.optimizeChunkAssets.tap('RaxDuplicateCheckerPlugin', chunks => {
          for (const chunk of chunks) {
            // Entry only
            if (!chunk.canBeInitial()) {
              continue;
            }

            chunk.files.forEach(function(file) {
              compilation.assets[file] = new ConcatSource(
                compilation.assets[file],
                '\n',
                errorMessages
              );
            });
          }
        });
      });
    } else {
      compiler.plugin('compilation', (compilation) => {
        const duplicates = check(compilation, modulesToCheck);
        if (!Object.keys(duplicates).length) {
          return;
        }

        const errorMessages = `console.error('${formatMsg(duplicates)}');`;

        compilation.plugin('optimize-chunk-assets', function(chunks) {
          chunks.forEach((chunk) => {
            // Entry only
            try {
              // In webpack2 chunk.initial was removed. Use isInitial()
              if (!chunk.initial) return;
            } catch (e) {
              if (!chunk.isInitial()) return;
            }

            chunk.files.forEach(function(file) {
              compilation.assets[file] = new ConcatSource(
                compilation.assets[file],
                '\n',
                errorMessages
              );
            });
          });
        });
      });
    }
  }
}
