export const RELATIVE_COMPONENTS_REG = /^\..*(\.jsx?)?$/i;
export const MINIAPP_PLUGIN_COMPONENTS_REG = /^plugin\:\/\//;

export const PKG_NAME_REG = new RegExp(`^.*\\${sep}node_modules\\${sep}([^\\${sep}]*).*$`);
export const GROUP_PKG_NAME_REG = new RegExp(`^.*\\${sep}node_modules\\${sep}([^\\${sep}]*?\\${sep}[^\\${sep}]*).*$`);
