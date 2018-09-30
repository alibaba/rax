import app from '/vendors/coreApp.js';

app.on('launch', (options) => {
  console.log('app on launch', options);
});
app.on('show', () => {
  console.log('app on show');
});

module.exports = app;