/* eslint-disable import/no-extraneous-dependencies */
const enzyme = require('enzyme');
const Adapter = require('../../src');

// Setup Enzyme
enzyme.configure({ adapter: new Adapter() });
