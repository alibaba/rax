/**
 * Scripts to check unpublished version and run publish
 */
const { existsSync, readdirSync, readFileSync } = require('fs');
const { join } = require('path');
const { spawnSync } = require('child_process');
const axios = require('axios');
const semver = require('semver');

const RETRY_LIMIT = 8;
const TIMEOUT = 5000;

function checkVersion(folder, callback) {
  const ret = []; // { name: 'foo', workDir, latest: 'x.x.x', local: 'x.x.x' }
  if (existsSync(folder)) {
    const packages = readdirSync(folder)
      // ignore dot files.
      .filter((filename) => filename[0] != '.');
    console.log('[PUBLISH] Start check with following packages:');
    console.log(packages.map(p => '- ' + p).join('\n'));

    let finishCount = 0;
    function finish() {
      finishCount++;
      if (finishCount === packages.length) {
        callback(ret);
      }
    }

    for (let i = 0; i < packages.length; i++) {
      const packageFolderName = packages[i];
      const packageInfoPath = join(folder, packageFolderName, 'package.json');
      if (existsSync(packageInfoPath)) {
        const packageInfo = JSON.parse(readFileSync(packageInfoPath));
        checkVersionExists(packageInfo.name, packageInfo.version).then(
          exists => {
            if (!exists) {
              ret.push({
                name: packageInfo.name,
                workDir: join(folder, packageFolderName),
                local: packageInfo.version,
              });
            }
            finish();
          },
        );
      } else {
        finish();
      }
    }
  } else {
    callback(ret);
  }
}


function checkVersionExists(pkg, version, retry = 0) {
  return axios(
    `http://registry.npmjs.com/${encodeURIComponent(pkg)}/${encodeURIComponent(
      version,
    )}`,
    { timeout: TIMEOUT }
  )
    .then(res => res.status === 200)
    .catch(err => {
      if (err.response && err.response.status === 404 || retry >= RETRY_LIMIT) {
        return false;
      } else {
        console.log(`Retry ${pkg}@${version} Time: ${retry + 1}`);
        return checkVersionExists(pkg, version, retry + 1);
      }
    });
}

function publish(pkg, workDir, version, tag) {
  console.log('[PUBLISH]', `${pkg}@${version}`);

  // npm publish
  spawnSync('npm', [
    'publish',
    '--tag=' + tag,
    // use default registry
  ], {
    stdio: 'inherit',
    cwd: workDir,
  });
}

function isPrerelease(v) {
  const semVer = semver.parse(v);
  if (semVer === null) return false;
  return semVer.prerelease.length > 0;
}

function checkVersionAndPublish() {
  checkVersion(join(__dirname, '../packages'), ret => {
    console.log('');
    if (ret.length === 0) {
      console.log('[PUBLISH] No diff with all packages.');
    } else {
      console.log('[PUBLISH] Will publish following packages:');
    }

    for (let i = 0; i < ret.length; i++) {
      const { name, workDir, local } = ret[i];
      const tag = ret[i].tag = isPrerelease(local) ? 'beta' : 'latest';
      console.log(`--- ${name}@${local} current tag: ${tag} ---`);
    }

    if (ret.length > 0) {
      for (let i = 0; i < ret.length; i++) {
        const { name, workDir, local, tag } = ret[i];
        publish(name, workDir, local, tag);
      }
    }
  });
}

checkVersionAndPublish();
