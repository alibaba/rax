const chalk = require('chalk');
const path = require('path');
const consoleClear = require('console-clear');
const { handleWebpackErr } = require('rax-compile-config');
const qrcode = require('qrcode-terminal');

const getEntrys = require('./getEntrys');
const setEntry = require('./setEntry');

module.exports = ({ context, chainWebpack, onHook }) => {
  const { rootDir, command, userConfig } = context;
  const { outputDir } = userConfig;
  const entrys = getEntrys(context);

  let targets = [];

  chainWebpack((config) => {
    targets = context.__configArr.map(v => v.name);

    if (~targets.indexOf('web')) {
      setEntry(config.getConfig('web'), context, entrys, 'web');

      if (command === 'dev') {
        const webConfig = config.getConfig('web');
        webConfig.devServer.set('before', (app, devServer) => {
          const memFs = devServer.compiler.compilers[0].outputFileSystem;
          entrys.forEach(({ entryName }) => {
            app.get(`/${entryName}`, function(req, res) {
              const htmlPath = path.resolve(rootDir, outputDir, `web/${entryName}.html`);
              const outPut = memFs.readFileSync(htmlPath).toString();
              res.send(outPut);
            });
          });
        });
      }
    }

    if (~targets.indexOf('weex')) {
      setEntry(config.getConfig('weex'), context, entrys, 'weex');
    }
  });

  onHook('after.devCompile', async({ url, err, stats }) => {
    consoleClear(true);

    if (!handleWebpackErr(err, stats)) {
      return;
    }

    console.log(chalk.green('Rax build finished:'));
    console.log();

    console.log(chalk.green('Rax development server has been started:'));
    console.log();

    if (~targets.indexOf('web')) {
      console.log(chalk.green('[Web] Development server at:'));
      entrys.forEach(({ entryName }) => {
        console.log('   ', chalk.underline.white(`${url}/${entryName}`));
      });
      console.log();
    }

    if (~targets.indexOf('weex')) {
      console.log(chalk.green('[Weex] Development server at:'));
      entrys.forEach(({ entryName }) => {
        const weexUrl = `${url}/weex/${entryName}.js?wh_weex=true`;
        console.log('   ', chalk.underline.white(weexUrl));
        if (process.env.QRCODE === 'true') {
          console.log();
          qrcode.generate(weexUrl, {small: true});
        }
      });
      console.log();

      console.log(chalk.yellow('Set environment `QRCODE=true` to see weex qrcode.'));
    }
  });
};
