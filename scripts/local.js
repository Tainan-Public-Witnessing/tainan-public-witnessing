const cp = require("child_process");
const fs = require("fs");
const path = require("path");
const chalk = require('chalk');

const projRoot = path.resolve(__dirname, "..");

/** @type{cp.ChildProcessWithoutNullStreams | undefined} */
let poetry;
function initPoetry() {
  if (poetry) {
    poetry.kill();
  }
  poetry = cp.spawn("poetry", ["run", "python", "backend/main.py"], {
    cwd: projRoot,
  }).on('error', (err) => {
    console.log('poetry errored', err);
  });
  poetry.stdout.on("data", data => console.log(chalk.blue(data)));
  poetry.stderr.on("data", data => console.log(chalk.bgBlue(data)));
}
initPoetry();
fs.watch(path.resolve(__dirname, '../backend'), (evt, filename) => {
  console.log('Poetry Reloading:', evt, filename);
  initPoetry();
});



const node = cp.spawn("yarn", ['start', '--', '--configuration', 'local'], {
  cwd: path.resolve(__dirname, ".."),
});
node.stdout.on("data", data => console.log(chalk.green(data)));
node.stderr.on("data", data => console.log(chalk.bgGreen(data)));
node.on('error', (err) => {
  console.log(chalk.red('node errored:', err));
});
