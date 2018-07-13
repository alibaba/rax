export function callWithCallback(fn, rawOptions = {}, options = {}, success, fail) {
  fn(options, res => {
    if (success) res = success(res);
    rawOptions.success && rawOptions.success(res);
    rawOptions.complete && rawOptions.complete(res);
  }, error => {
    if (fail) error = fail(error);
    rawOptions.fail && rawOptions.fail(error);
    rawOptions.complete && rawOptions.complete(error);
  });
}
