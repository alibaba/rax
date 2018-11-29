const mkdirp = require('mkdirp');
const { join } = require('path');
const { existsSync } = require('fs');
const copy = require('../copy');

/**
 * Build Schema Files for template miniapp
 *   |---- .schema
 *   |     |----app.config.json  // same to miniapp config
 *   |     |----mock-data.json  // template mock data
 *   |     |----schema.json     // template schema
 */
module.exports = function(destDir, projectDir) {
  const schemaSource = join(destDir, 'schema');
  return (done) => {
    if (!existsSync(schemaSource)) {
      done();
      return;
    }

    const schemaDest = join(destDir, '.schema');
    mkdirp.sync(schemaDest);

    copyIfExists(
      join(projectDir, 'app.config.json'),
      join(schemaDest, 'app.config.json')
    );
    copyIfExists(
      join(schemaSource, 'schema.json'),
      join(schemaDest, 'schema.json'),
    );
    copyIfExists(
      join(schemaSource, 'mock-data.json'),
      join(schemaDest, 'mock-data.json'),
    );
    done();
  };
};

function copyIfExists(from, to) {
  if (existsSync(from)) {
    copy(from, to);
  }
}
