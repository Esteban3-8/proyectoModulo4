const path = require('node:path');
const fs = require('node:fs');
const { buildSync } = require('esbuild');
const { Server, config } = require('karma');
const root = path.resolve(__dirname, '..');
process.chdir(root);
if (!process.env.CHROME_BIN && process.platform === 'win32') {
  const browser = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  ].find(file => fs.existsSync(file));
  if (browser) process.env.CHROME_BIN = browser;
}
buildSync({
  entryPoints: ['tests/unit.spec.ts'],
  bundle: true,
  platform: 'browser',
  sourcemap: 'inline',
  outfile: 'tmp/tests/unit.spec.js',
});
config.parseConfig(path.join(root, 'karma.conf.cjs'), {}, { promiseConfig: true, throwErrors: true })
  .then(configuration => new Server(configuration, code => { process.exitCode = code; }).start())
  .catch(error => { console.error(error); process.exitCode = 1; });
