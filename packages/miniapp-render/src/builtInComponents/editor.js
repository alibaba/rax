export default {
  name: 'editor',
  singleEvents: [{
    name: 'onEditorReady',
    eventName: 'ready'
  },
  {
    name: 'onEditorFocus',
    eventName: 'focus'
  },
  {
    name: 'onEditorBlur',
    eventName: 'blur'
  },
  {
    name: 'onEditorInput',
    eventName: 'input'
  },
  {
    name: 'onEditorStatusChange',
    eventName: 'statuschange'
  }]
};
