/* global ATAG_URL */
import css from 'raw-loader!../../../core/renderer/global.css';

const webcomponentsPolyfillURL = 'https://g.alicdn.com/code/npm/@webcomponents/webcomponentsjs/2.0.4/bundles/webcomponents-sd-ce-pf.js';

export function getIframeSrcDoc({ viewport = 1 }) {
  return [
    '<!DOCTYPE html>',
    '<html data-iframe-root>',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="aplus-ifr-pv" content="1">',
    `<meta name="viewport" content="width=device-width, initial-scale=${viewport}, maximum-scale=${viewport}, minimum-scale=${viewport}, user-scalable=no">`,
    '<meta name="apple-mobile-web-app-capable" content="yes">',
    '<meta name="apple-mobile-web-app-status-bar-style" content="black">',
    '<meta name="format-detection" content="telephone=no">',
    '<title>MiniApp IDE</title>',
    `<style>${css}</style>`,
    `<script src="${webcomponentsPolyfillURL}">`,
    '<\/script>',
    `<script src="${ATAG_URL}">`,
    '<\/script>',
    '</head>',
    '<body>',
    '<\/body>',
    '</html>'].join('');
}
