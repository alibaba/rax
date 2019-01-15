/**
 * External polymers.
 * @NOTE Must add `.js` suffix to prevent match webpack's external rule.
 */
import * as Polymer from '@polymer/polymer/polymer-element';
import * as Gestures from '@polymer/polymer/lib/utils/gestures.js';
import * as RenderStatus from '@polymer/polymer/lib/utils/render-status.js';
import * as DOMRepeat from '@polymer/polymer/lib/elements/dom-repeat.js';

window.Polymer = Polymer;
window.PolymerGestures = Gestures;
window.PolymerRenderStatus = RenderStatus;
window.PolymerDOMRepeat = DOMRepeat;
