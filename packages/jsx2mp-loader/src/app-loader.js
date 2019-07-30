const { readJSONSync, writeJSONSync, writeFileSync, readFileSync, existsSync, mkdirSync } = require('fs-extra');
const { relative, join } = require('path');
const compiler = require('jsx-compiler');

const pageLoader = require.resolve('./page-loader');

function createImportStatement(req) {
  return `import '${req}';`;
}

module.exports = function appLoader(content) {
  const rawContent = readFileSync(this.resourcePath, 'utf-8');
  const config = readJSONSync(join(this.rootContext, 'app.json'));
  const compilerOptions = Object.assign({}, compiler.baseOptions, {
    filePath: this.resourcePath,
    type: 'app',
  });
  const transformed = compiler(rawContent, compilerOptions);

  const distPath = this._compiler.outputPath;
  if (!existsSync(distPath)) mkdirSync(distPath);

  const relativeSourcePath = relative(this.rootContext, this.resourcePath);
  const targetFilePath = join(distPath, relativeSourcePath);

  this.addDependency(join(this.rootContext, 'app.json'));

  writeFileSync(join(distPath, 'app.js'), transformed.code);
  writeJSONSync(join(distPath, 'app.json'), config, { spaces: 2 });

  if (transformed.style) {
    writeFileSync(join(distPath, 'app.acss'), transformed.style);
  }


  return content;
}
