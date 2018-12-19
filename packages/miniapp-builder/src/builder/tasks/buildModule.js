const { join } = require('path');
const { existsSync, readFileSync, writeFileSync } = require('fs');
const colors = require('colors');
const klawSync = require('klaw-sync');
const getMiniappType = require('../../config/getMiniappType');

module.exports = function(destDir, projectDir) {
  return done => {
    const miniappType = getMiniappType(projectDir);
    const assetBuildConfigPath = join(projectDir, 'abc.json');

    if (miniappType !== 'mp') {
      done();
      return;
    }

    if (!existsSync(assetBuildConfigPath)) {
      console.log(colors.green('[Skip] abc.json not exists, skip building template module.'));
      done();
      return;
    }

    let appExtraInfo;
    let assetBuildConfig;
    try {
      assetBuildConfig = JSON.parse(readFileSync(assetBuildConfigPath, 'utf8'));
    } catch (err) {
      console.log(colors.red('[ERR] Reading or parsing abc.json'));
      done();
      return;
    }

    try {
      appExtraInfo = JSON.parse(assetBuildConfig.projectinfo.ext);
    } catch (err) {
      console.log(colors.red('[ERR] Reading or parsing extra info from abc.json, please check projectinfo.ext field.'));
      done();
      return;
    }

    if (!appExtraInfo) {
      console.log(colors.red('[ERR] App extra info empty, please check projectinfo.ext field in abc.json.'));
      done();
      return;
    }

    const pageMeta = {
      appId: appExtraInfo.appId,
      name: appExtraInfo.name,
      type: appExtraInfo.type,
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
