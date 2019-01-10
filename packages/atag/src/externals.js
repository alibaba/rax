/**
 * External polymers.
 * @NOTE Must add `.js` suffix to prevent match webpack's external rule.
 */
import * as Polymer from '@polymer/polymer/polymer-element';
import * as Gestures from '@polymer/polymer/lib/utils/gestures.js';
import * as RenderStatus from '@polymer/polymer/lib/utils/render-status.js';
import * as DOMRepeat from '@polymer/polymer/lib/elements/dom-repeat.js';

window.__Polymer__ = Polymer;
window.__Polymer_Gestures__ = Gestures;
window.__Polymer_Render_Status__ = RenderStatus;
window.__Polymer_DOMRepeat__ = DOMRepeat;
