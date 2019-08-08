const fs = require('fs');
const easyfile = require('easyfile');
const path = require('path');

// a template process middleware layer
module.exports = class TemplateProcesser {
  constructor(template) {
    this.template = template;
    this.fns = [];
    this.target = process.cwd();
  }

  // use a middleware `fn`
  use(fn) {
    this.fns.push(fn);
    return this;
  }

  // set `target`
  writeTo(target) {
    this.target = target || this.target;

    return this;
  }

  // process and write files
  done(target) {
    const files = this._processFiles();

    this
      .writeTo(target)
      .writeFiles(files);
  }

  // write files to `target`
  writeFiles(files) {
    const target = this.target;

    try {
      files.forEach(file => {
        const { content, name } = file;

        easyfile.write(path.resolve(target, name), content, {
          force: true,
          backup: true,
        });
      });
    } catch (err) {
      throw err;
    }

    return this;
  }

  // process files
  _processFiles() {
    try {
      const fns = this.fns;
      const files = getFiles(this.template);

      for (let i = 0; i < fns.length; i++) {
        const fn = fns[i];
        fn.call(this, files);
      }

      return files;
    } catch (err) {
      throw err;
    }
  }
};

function getFiles(dir) {
  const files = [];

  function fileMapGenerator(projectDir) {
    easyfile.readdir(projectDir).forEach(filename => {
      const currPath = path.join(projectDir, filename);

      if (easyfile.isFile(currPath)) {
        files.push({
          content: fs.readFileSync(currPath, 'utf-8'),
          name: path.relative(dir, currPath),
        });
      } else {
        fileMapGenerator(currPath);
      }
    });
  }

  fileMapGenerator(dir);

  return files;
}
