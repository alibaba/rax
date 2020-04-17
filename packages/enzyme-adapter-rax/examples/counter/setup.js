/* eslint-disable import/no-extraneous-dependencies */
const { JSDOM } = require('jsdom');
const enzyme = require('enzyme');
const Adapter = require('../../src');

// Setup JSDOM
const dom = new JSDOM('', {
  // Enable `requestAnimationFrame` which Preact uses internally.
  pretendToBeVisual: true,
});

global.Event = dom.window.Event;
global.Node = dom.window.Node;
global.window = dom.window;
global.document = dom.window.document;
global.requestAnimationFrame = dom.window.requestAnimationFrame;

// Setup Enzyme
enzyme.configure({ adapter: new Adapter() });
