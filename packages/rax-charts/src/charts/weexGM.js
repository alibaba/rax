import GM from 'g2-mobile';

let _context;
const _chartRender = GM.Chart.prototype.render;

GM.Chart.prototype.render = function() {
  _chartRender.call(this);
  _context.render();
};

GM.ready = function(context) {
  _context = context;
};

export default GM;
