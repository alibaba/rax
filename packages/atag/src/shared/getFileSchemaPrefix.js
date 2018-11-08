import getEnvironmentObject from './getEnvironmentObject';

const FILE_SCHEMA_PREFIX_FROM_ENV = 'fileSchemaPrefix';
const FILE_SCHEMA_PREFIX_FROM_URL = '__file_schema_prefix__';

/**
 * Get the schema of local file reader, like image, video and so on.
 * Transform url from `/images/logo.png` -> `${prefix}/image/logo.png`
 * to make native recognize the mapping relationship of local file.
 * Two ways to get prefix string:
 *   1. envObject.fileSchemaPrefix
 *   2. query string (compatbile way)
 */
export default function getFileSchemaPrefix() {
  const env = getEnvironmentObject();
  if (env && env[FILE_SCHEMA_PREFIX_FROM_ENV]) {
    return env[FILE_SCHEMA_PREFIX_FROM_ENV];
  } else {
    return extractQuery(FILE_SCHEMA_PREFIX_FROM_URL);
  }
}

function extractQuery(param) {
  const { href } = location;
  const match = (new RegExp(`${param}=([^&]+)`)).exec(href);
  if (match) {
    let result = decodeURIComponent(match[1]);
    let hashIdx = result.indexOf('#');
    if (hashIdx > -1) result = result.slice(0, hashIdx);
    return result;
  } else {
    return '';
  }
}
