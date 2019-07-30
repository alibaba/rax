const { readJSONSync, writeJSONSync, writeFileSync, readFileSync, existsSync, mkdirSync } = require('fs-extra');
const { relative, join, dirname, extname } = require('path');
const compiler = require('jsx-compiler');

module.exports = function pageLoader(content) {
  const rawContent = readFileSync(this.resourcePath, 'utf-8');
  const compilerOptions = Object.assign({}, compiler.baseOptions, {
    filePath: this.resourcePath,
    type: 'page',
  });

  const distPath = this._compiler.outputPath;
  const relativeSourcePath = relative(this.rootContext, this.resourcePath);
  const targetFilePath = join(distPath, relativeSourcePath);

  console.log(relativeSourcePath);

  const transformed = compiler(rawContent, compilerOptions);

  const pageDistDir = dirname(join(distPath, relativeSourcePath));
  if (!existsSync(pageDistDir)) mkdirSync(pageDistDir);

  const distFileWithoutExt = removeExt(join(distPath, relativeSourcePath));

  writeFileSync(distFileWithoutExt + '.js', transformed.code);
  writeFileSync(distFileWithoutExt + '.axml', transformed.template);
  writeJSONSync(distFileWithoutExt + '.json', transformed.config, { spaces: 2 });
  if (transformed.style) {
    writeFileSync(distFileWithoutExt + '.acss', transformed.style);
  }

  return content;
}

function removeExt(path) {
  const ext = extname(path);
  return path.slice(0, path.length - ext.length);
}

