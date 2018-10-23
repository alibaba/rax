const { join } = require('path');
const { existsSync, readFileSync, writeFileSync } = require('fs');
const colors = require('colors');
const klawSync = require('klaw-sync');
const getMiniappType = require('../../config/getMiniappType');

module.exports = function(destDir, projectDir) {
  return done => {
    const miniappType = getMiniappType(projectDir);

    if (miniappType !== 'mp' || !existsSync(join(projectDir, 'abc.json'))) {
      done();
      return;
    }

    let appJSON;

    try {
      appJSON = JSON.parse(
        JSON.parse(readFileSync(join(projectDir, 'abc.json'), 'utf8'))
          .projectinfo.ext
      );
    } catch (err) {
      console.log('[Warn] Skipping Build Mod.');
      done();
    }

    const pageMeta = {
      appId: appJSON.appId,
      name: appJSON.name,
      type: appJSON.type,
      pages: {},
      modules: []
    };
    const mods = [];

    const modsDir = join(projectDir, 'mods');
    if (existsSync(modsDir)) {
      const dirs = klawSync(modsDir, { nofile: true, depthLimit: 0 });
      for (const { path } of dirs) {
        const packageDir = join(path, 'package.json');
        const schemaDir = join(path, 'schema/data.json');
        const mockDir = join(path, 'mock/data.json');
        if (
          existsSync(packageDir) &&
          existsSync(schemaDir) &&
          existsSync(mockDir)
        ) {
          try {
            const data =
              JSON.parse(readFileSync(packageDir, 'utf8')).blockConfig || {};
            data.schema = JSON.parse(readFileSync(schemaDir, 'utf8') || '{}');
            data.mock = JSON.parse(readFileSync(mockDir, 'utf8') || '{}');
            pageMeta.modules.push(data);
            mods.push(data.name);
          } catch (e) {
            console.log(colors.yellow('[PageMeta] Mod format not valid.'));
          }
        }
      }

      writeFileSync(
        join(destDir, 'pageMeta.json'),
        JSON.stringify(pageMeta, null, '  '),
        'utf8'
      );

      console.log(
        colors.green('[PageMeta] Mod built successfully：', mods.join(', '))
      );
    } else {
      console.log(
        colors.green('[PageMeta] Skipping build, due to mods dir missing.')
      );
    }

    done();
  };
};
