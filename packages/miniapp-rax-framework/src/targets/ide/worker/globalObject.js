import my from './modules/my';
import runtimeAPI from './modules/runtimeAPI';
import wmlEnv from './modules/wmlEnv';

export default {
  my,
  __file_schema_prefix__: '',
  __windmill_environment__: wmlEnv,
  __WINDMILL_WORKER_RUNTIME_APIS__: runtimeAPI,
};
