const mkdirp = require('mkdirp');
const { join } = require('path');
const { existsSync } = require('fs');
const copy = require('../copy');

const APP_CONFIG = 'app.config.json';
const SCHEMA_CONFIG = 'schema.json';
const MOCK_DATA = 'mock-data.json';

/**
 * Build Schema Files for template miniapp
 *   |---- .schema
 *   |     |----app.config.json  // same to miniapp config
 *   |     |----mock-data.json  // template mock data
 *   |     |----schema.json     // template schema
 */
module.exports = function(destDir, projectDir) {
  const schemaSource = join(projectDir, 'schema');
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
    copyIfExists(
      join(schemaSource, SCHEMA_CONFIG),
      join(schemaDest, SCHEMA_CONFIG),
    );
    copyIfExists(
      join(schemaSource, MOCK_DATA),
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
