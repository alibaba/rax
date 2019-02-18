import * as utils from '../utils';
import * as routes from '../Router';

export function switchTab({ url }) {
  routes.switchTab({
    pageName: url
  });
}

export function showTabBar(params, resolveCallback, rejectCallback) {
  const tabbarContainer = utils.getTabBar();
  const mainContainer = utils.getContainer();

  if (tabbarContainer) {
    tabbarContainer.style.display = 'flex';
  }

  if (mainContainer) {
    mainContainer.style.bottom = '12.8vw';
  }

  resolveCallback();
}

export function hideTabBar(params, resolveCallback, rejectCallback) {
  const tabbarContainer = utils.getTabBar();
  const mainContainer = utils.getContainer();

  if (tabbarContainer) {
    tabbarContainer.style.display = 'none';
  }

  if (mainContainer) {
    mainContainer.style.bottom = '0px';
  }

  resolveCallback();
}

export function setTabBarBadge(params, resolveCallback, rejectCallback) {
  const tabbarContainer = utils.getTabBar();
  const items = tabbarContainer.children;
  const item = items[params.index];

  const prevBadge = item.querySelector('.badge');
  if (prevBadge) {
    prevBadge.innerHTML = params.text;
  } else {
    const badge = document.createElement('div');
    badge.setAttribute('class', 'badge');
    badge.innerHTML = params.text;
    item.appendChild(badge);
  }

  resolveCallback();
}

export function removeTabBarBadge(params, resolveCallback, rejectCallback) {
  const tabbarContainer = utils.getTabBar();
  const items = tabbarContainer.children;
  const item = items[params.index];

  const prevBadge = item.querySelector('.badge');
  if (prevBadge) {
    prevBadge.remove();
  }

  resolveCallback();
}

export function showTabBarRedDot(params, resolveCallback, rejectCallback) {
  const tabbarContainer = utils.getTabBar();
  const items = tabbarContainer.children;
  const item = items[params.index];

  const prevDot = item.querySelector('.hot-dot');
  if (!prevDot) {
    const prevDot = document.createElement('div');
    prevDot.setAttribute('class', 'hot-dot');
    item.appendChild(prevDot);
  }

  resolveCallback();
}

export function hideTabBarRedDot(params, resolveCallback, rejectCallback) {
  const tabbarContainer = utils.getTabBar();
  const items = tabbarContainer.children;
  const item = items[params.index];

  const prevDot = item.querySelector('.hot-dot');
  if (prevDot) {
    prevDot.remove();
  }

  resolveCallback();
}
