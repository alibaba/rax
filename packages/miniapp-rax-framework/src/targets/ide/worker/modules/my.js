// import ctxRequire from '../require';
// import runtimeAPI from './runtimeAPI';
// import wmlEnv from './wmlEnv';
// import getAvailableAPIs from 'raw-loader!windmill-module-api';

// const ctxModule = { exports: {} };
// ; (new Function('module', 'exports', 'global', getAvailableAPIs))(
//   ctxModule,
//   ctxModule.exports,
//   {
//     require: ctxRequire,
//     __windmill_environment__: wmlEnv,
//     __WINDMILL_WORKER_RUNTIME_APIS__: runtimeAPI
//   }
// );

// let my = {};
// if (typeof ctxModule.exports === 'function') {
//   const { my: modules } = ctxModule.exports();
//   Object.assign(my, modules);
// }

export default {
  'FAKE_MY': true,
};
