const { join, extname } = require('path');
const { copySync, mkdirpSync, existsSync, renameSync } = require('fs-extra');

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
    mkdirpSync(schemaDest);

    /**
     * Must ensure .schema/app.config.json exists,
     * for server to read.
     */
    copySync(
      join(destDir, APP_CONFIG),
      join(schemaDest, APP_CONFIG)
    );

    /**
     * Copy folder: schema => .schema
     * Only copy json file.
     */
    copyIfExists(schemaSource, schemaDest, {
      filter: (src) => {
        // Pass folder itself
        if (src === schemaSource) return true;
        return extname(src) === '.json';
      }
    });

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

function copyIfExists(from, to, opts) {
  if (existsSync(from)) {
    copySync(from, to, opts);
  }
}
