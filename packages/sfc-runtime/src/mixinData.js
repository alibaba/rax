import observe from './observe';
import nextTick from './nextTick';

let allowUpdate = true;
export function toggleUpdate(allow) {
  const type = typeof allow;
  if (type === 'undefined') {
    allowUpdate = !allowUpdate;
  } else if (type === 'boolean') {
    allowUpdate = allow;
  }
}

function observeWithContext(data, context, def) {
  let isDirty = false;

  function update() {
    nextTick(() => {
      if (allowUpdate && isDirty) {
        context.forceUpdate();
        isDirty = false;
      }
    }, context);
  }

  observe(data, {
    afterSetter: () => {
      isDirty = true;
      update();
    },
  });
}
export { observeWithContext };

export default function mixinData(context, declearation) {
  // init reactive data
  var data = context.data; // data always exists
  var __data_type = typeof declearation.data;
  if (__data_type === 'function') {
    data = declearation.data.call(context);
  } else if (
    __data_type === 'object' &&
    process.env.NODE_ENV !== 'production'
  ) {
    /* istanbul ignore next */
    console.error(
      '[SFC Loader WARN]:',
      'The "data" option should be a function that returns a per-instance value in component definitions.'
    );
    data = declearation.data;
  } else {
    /* istanbul ignore next */
    data = {};
  }
  context._data = data;

  // $data getter
  Object.defineProperty(context, '$data', {
    get() {
      return data;
    },
  });

  if (!data) {
    return;
  }

  observeWithContext(data, context, declearation);

  Object.keys(data).forEach(dataKey => {
    context[dataKey] = data[dataKey];
    Object.defineProperty(context, dataKey, {
      enumerable: true,
      configurable: true,
      get: function proxyGet() {
        return data[dataKey];
      },
      set: function proxySet(newVal) {
        data[dataKey] = newVal;
      },
    });
  });
}
