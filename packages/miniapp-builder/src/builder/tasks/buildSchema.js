const mkdirp = require('mkdirp');
const { join, extname } = require('path');
const { existsSync, readdirSync, renameSync } = require('fs');
const copy = require('../copy');

const APP_CONFIG = 'app.config.json';
const DATA_JSON = 'data.json';
const SCHEMA_CONFIG = 'schema.json';
const MOCK_DATA = 'mock-data.json';

/**
 * Build Schema Files for template miniapp
 *   |---- .schema
 *   |     |----app.config.json  // same to miniapp config
 *   |     |----mock-data.json  // template mock data, from mock/data.json
 *   |     |----schema.json     // template schema, from schema/data.json
 */
module.exports = function(destDir, projectDir) {
  const schemaSource = join(projectDir, 'schema');
  const mockSource = join(projectDir, 'mock');
  return (done) => {
    const schemaDest = join(destDir, '.schema');
    mkdirp.sync(schemaDest);

    /**
     * Must ensure .schema/app.config.json exists,
     * for server to read.
     */
    copy(
      join(destDir, APP_CONFIG),
      join(schemaDest, APP_CONFIG)
    );

    /**
     * Copy folder: schema => .schema
     * Only copy json file.
     */
    copyFolder(schemaSource, schemaDest, (filename) => extname(filename) === '.json');

    /**
     * Rename .schema/data.json -> .schema/schema.json
     */
    const schemaDestData = join(schemaDest, DATA_JSON);
    if (existsSync(schemaDestData)) {
      renameSync(schemaDestData, join(schemaDest, SCHEMA_CONFIG));
    }

    /**
     * Copy mock/data.json -> .schema/mock-data.json
     */
    copyIfExists(
      join(mockSource, DATA_JSON),
      join(schemaDest, MOCK_DATA),
    );

    done();
  };
};

function copyIfExists(from, to) {
  if (existsSync(from)) {
    copy(from, to);
  }
}

function copyFolder(fromFolder, toFolder, filter = () => true) {
  const files = readdirSync(fromFolder);
  if (Array.isArray(files)) {
    for (let i = 0, l = files.length; i < l; i ++) {
      if (filter(files[i])) {
        const from = join(fromFolder, files[i]);
        const to = join(toFolder, files[i]);
        copy(from, to);
      }
    }
  }
}
