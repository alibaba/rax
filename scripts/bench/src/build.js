
const exec = require('child_process').exec;
const { join } = require('path');

function executeCommand(command) {
  return new Promise(_resolve =>
    exec(command, error => {
      if (!error) {
        _resolve();
      } else {
        console.error(error);
        process.exit(1);
      }
    })
  );
}

async function buildBundles(framework) {
  const frameworkPath = join(__dirname, `../frameworks/${framework}`);

  console.log(`building ${framework} in directory ${frameworkPath}`);
  console.log();
  console.log('running npm install && npm run build-prod');
  console.log();

  return await executeCommand(
    `cd ${frameworkPath} && rm -rf node_modules && rm -rf dist && npm install && npm run build-prod`
  );
}

module.exports = {
  buildBundles
};