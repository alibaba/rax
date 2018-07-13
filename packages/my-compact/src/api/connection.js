import Connection from '@core/connection';
import { callWithCallback } from '../util';

export function getNetworkType(options) {
  callWithCallback(Connection.getType, options, {}, res => {
    const type = res.type || '';
    return {
      networkType: type.toUpperCase()
    };
  });
}

export function onNetworkStatusChange(cb) {
  Connection.onChange({}, res => {
    const type = res.type || '';
    return {
      networkType: type.toUpperCase()
    };
  });
}
