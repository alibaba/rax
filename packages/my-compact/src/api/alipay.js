import alipay from '@core/alipay';
import { callWithCallback } from '../util';

export function tradePay(options) {
  callWithCallback(alipay.tradePay, options, {
    orderStr: options.orderStr
  });
}
