const { sep } = require('path');

const RELATIVE_COMPONENTS_REG = /^\..*(\.jsx?)?$/i;
const MINIAPP_PLUGIN_COMPONENTS_REG = /^plugin\:\/\//;

const PKG_NAME_REG = new RegExp(`^.*\\${sep}node_modules\\${sep}([^\\${sep}]*).*$`);
const GROUP_PKG_NAME_REG = new RegExp(`^.*\\${sep}node_modules\\${sep}([^\\${sep}]*?\\${sep}[^\\${sep}]*).*$`);

module.exports = {
  RELATIVE_COMPONENTS_REG,
  MINIAPP_PLUGIN_COMPONENTS_REG,
  PKG_NAME_REG,
  GROUP_PKG_NAME_REG
};
