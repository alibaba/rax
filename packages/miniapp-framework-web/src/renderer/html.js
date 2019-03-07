/* global atagVersion */
import BASE_STYLE from '!!raw-loader!./base.css';

const POLYFILL_URL = 'https://g.alicdn.com/code/npm/@webcomponents/webcomponentsjs/2.0.4/bundles/webcomponents-sd-ce-pf.js';
const ATAG_URL = `https://g.alicdn.com/code/npm/atag/${atagVersion}/dist/atag.js`;

export function generateHTML({ viewport = 1 }) {
  return [
    '<!DOCTYPE html>',
    '<html data-iframe-root>',
    '<head>',
    '<meta charset="utf-8">',
    `<meta name="viewport" content="width=device-width, initial-scale=${viewport}, maximum-scale=${viewport}, minimum-scale=${viewport}, user-scalable=no">`,
    '<meta name="apple-mobile-web-app-capable" content="yes">',
    '<meta name="apple-mobile-web-app-status-bar-style" content="black">',
    '<meta name="format-detection" content="telephone=no">',
    `<style>${BASE_STYLE}</style>`,
    `<script src="${POLYFILL_URL}">`,
    '<\/script>',
    `<script src="${ATAG_URL}">`,
    '<\/script>',
    '</head>',
    '<body></body>',
    '</html>'].join('');
}
