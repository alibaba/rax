const { readFileSync } = require('fs');
const { join } = require('path');
const { execSync } = require('child_process');

const compileCommand = '../bin/jsx2mp.js build --type component --entry ./component --dist ./dist --turn-off-check-update';

let jsonContent, jsContent, axmlContent;

const currentCwd = process.cwd();
const cwd = currentCwd.indexOf('jsx2mp-cli') === -1 ? join(currentCwd, 'packages/jsx2mp-cli') : currentCwd;

const execSyncWithCwd = (command) => {
  execSync(command, {
    cwd
  });
};

beforeAll(() => {
  execSyncWithCwd(`cd demo && npm install --no-package-lock && ${compileCommand}`);

  // read from file and get compiled result
  jsonContent = readFileSync(join(cwd, 'demo/dist/component.json'), {encoding: 'utf8'});
  jsContent = readFileSync(join(cwd, 'demo/dist/component.js'), {encoding: 'utf8'});
  axmlContent = readFileSync(join(cwd, 'demo/dist/component.axml'), {encoding: 'utf8'});
});

afterAll(() => {
  execSyncWithCwd('rm -rf demo/dist');
});

describe('Component compiled result', () => {
  it('should return correct axml', () => {
    expect(axmlContent).toEqual(
      `<block a:if="{{$ready}}"><view class="__rax-view">
      Hello World!
      <rax-image source="{{ uri: _d0 }}" c="{{_d1 && _d2}}" d="{{_d0 ? _d1 : _d2}}" __tagId="{{__tagId}}-0" /></view></block>`);
  });

  it('should return correct js', () => {
    expect(jsContent).toEqual(
      '"use strict";var _jsx2mpRuntime=require("./npm/jsx2mp-runtime"),_index=require("./npm/rax-view/lib/index.js"),img="./assets/rax.png",a=0,b=1;function Index(){(0,_index.custom)(),this._updateChildProps("0",{source:{uri:img},c:a&&b,d:img?a:b}),this._updateData({_d0:img,_d1:a,_d2:b}),this._updateMethods({})}var __def__=Index;Component((0,_jsx2mpRuntime.createComponent)(__def__));'
    );
  });

  it('should return correct json', () => {
    expect(jsonContent).toEqual(
      `{
  "component": true,
  "usingComponents": {
    "rax-image": "./npm/rax-image/lib/miniapp/index"
  }
}
`
    );
  });
});
