import app from '@core/app';

app.on('launch', (options) => {
  console.log('app on launch', options);
});
app.on('show', () => {
  console.log('app on show');
});
