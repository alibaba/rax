
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

  return await executeCommand(
    `cd ${frameworkPath} && npm install && npm run build-prod`
  );
}

module.exports = {
  buildBundles
};