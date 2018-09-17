const mkdirp = require('mkdirp');
const { join } = require('path');
const { existsSync } = require('fs');
const copy = require('../copy');

module.exports = function(destDir, projectDir) {
  return (done) => {
    mkdirp.sync(join(destDir, '.schema'));

    const appConfigJSONPath = join(destDir, 'app.config.json');

    copy(
      appConfigJSONPath,
      join(destDir, '.schema/app.config.json')
    );

    const schemaPath = join(projectDir, 'schema', 'data.json');
    if (existsSync(schemaPath)) {
      copy(
        schemaPath,
        join(destDir, '.schema/schema.json')
      );
    }

    const mockPath = join(projectDir, 'mock', 'data.json');
    if (existsSync(mockPath)) {
      copy(
        mockPath,
        join(destDir, '.schema/mock-data.json')
      );
    }

    done();
  };
};
