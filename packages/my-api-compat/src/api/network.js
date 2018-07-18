import network from '@core/network';

export function httpRequest(options) {
  network.request({
    method: options.method || 'GET',
    url: options.url,
    headers: options.headers || { 'Content-Type': 'application/x-www-form-urlencoded' },
    dataType: options.dataType || 'json',
    body: options.data,
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
