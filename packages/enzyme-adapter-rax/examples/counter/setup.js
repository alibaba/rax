/* eslint-disable import/no-extraneous-dependencies */
const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-rax');

// Setup Enzyme
enzyme.configure({ adapter: new Adapter() });
