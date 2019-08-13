const path = require('path');
const { readdirSync } = require('fs');

const pluginDir = path.join(__dirname, './plugins');
const pluginList = readdirSync(pluginDir);
module.exports = ({ chainWebpack }, option) => {
  chainWebpack((config, { command }) => {
    try {
      // Only run in web app.
      if (config.getConfig('web')) {
        pluginList.forEach((plugin) => {
          config.plugin(plugin.replace(/\.js$/, ''))
            .use(require(`${pluginDir}/${plugin}`), [{
              ...option,
              command
            }]);
        });
      }
    } catch (e) {
      // There is no config named web
      // ignore
    }
  });
};
