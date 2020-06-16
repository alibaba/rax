import createEventProxy from '../bridge/createEventProxy';

export default function() {
  const config = {
    properties: {
      r: {
        type: Object,
        value: {}
      }
    },
    options: {
      styleIsolation: 'shared'
    },
    methods: createEventProxy()
  };
  return config;
}
