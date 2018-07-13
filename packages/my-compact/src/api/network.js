import network from '@core/network';

export function httpRequest(options) {
  network.request({
    method: options.method,
    type: options.type,
    url: options.url,
    body: options.data,
    dataType: options.dataType || { 'Content-Type': 'application/x-www-form-urlencoded' },
  }, response => {
    const res = {
      data: response.data,
      status: response.status,
      headers: response.headers
    };
    options.success && options.success(res);
    options.complete && options.complete(res);
  }, error => {
    options.fail && options.fail(error);
  });
}
