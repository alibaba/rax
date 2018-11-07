import getEnvironmentObject from './getEnvironmentObject';

const FILE_SCHEMA_PREFIX = '__file_schema_prefix__';

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
  if (env && env.fileSchemaPrefix) {
    return env.fileSchemaPrefix;
  } else {
    return extractQuery(FILE_SCHEMA_PREFIX);
  }
}

function extractQuery(param) {
  const { href } = location;
  const match = (new RegExp(`${param}=([^&]+)`)).exec(href);

  if (match) {
    return decodeURIComponent(match[1]);
  } else {
    return '';
  }
}
