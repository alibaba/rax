import path from 'path';
import fs from 'fs-extra';
import adapter from './adapter';

const DOM_SUBTREE_LEVEL = 10;

const CUSTOM_COMPONENT_CONTENT = {
  subtree: {
    jsContent: `Component({
      props: {
        childNodes: [],
        inCover: false
      }
    })`,
    jsonContent: `{
      "component": true,
      "usingComponents": {
        "element": "../../index",
        "subtree": "./index",
        "subtree-cover": "../subtree-cover/index"
      }
    }`
  },
  subtreeCover: {
    jsContent: `Component({
      props: {
        childNodes: []
      }
    })`,
    jsonContent: `{
      "component": true,
      "usingComponents": {
        "element": "../../index",
        "subtree": "../subtree/index",
        "subtree-cover": "./index"
      }
    }`
  }
}

/**
 * Get subtree, to generate single loop content
 */
function getSubtreeSimple(i, platform) {
  const itemName = `item${i}`;
  const isLast = i === DOM_SUBTREE_LEVEL;
  const isFirst = i === 1;
  const subContent = [
    `<block ${adapter[platform].if}="{{${itemName}.type === 'text'}}">{{${itemName}.content}}</block>`,
    `<image ${adapter[platform].elseif}="{{${itemName}.isImage}}" data-private-node-id="{{${itemName}.nodeId}}" data-private-page-id="{{${itemName}.pageId}}" id="{{${itemName}.id}}" class="{{${itemName}.class || ''}}" style="{{${itemName}.style || ''}}" src="{{${itemName}.src}}" rendering-mode="{{${itemName}.mode ? 'backgroundImage' : 'img'}}" mode="{{${itemName}.mode}}" lazy-load="{{${itemName}.lazyLoad}}" show-menu-by-longpress="{{${itemName}.showMenuByLongpress}}" ${adapter[platform].touchStart}="onTouchStart" ${adapter[platform].touchMove}="onTouchMove" ${adapter[platform].touchEnd}="onTouchEnd" ${adapter[platform].touchCancel}="onTouchCancel" ${adapter[platform].tap}="onTap" ${adapter[platform].load}="onImgLoad" ${adapter[platform].error}="onImgError"></image>`,
    `<view ${adapter[platform].elseif}="{{${itemName}.isLeaf${isLast ? '' : ' || ' + itemName + '.isSimple'}}}" data-private-node-id="{{${itemName}.nodeId}}" data-private-page-id="{{${itemName}.pageId}}" id="{{${itemName}.id}}" class="{{${itemName}.class || ''}}" style="{{${itemName}.style || ''}}" ${adapter[platform].touchStart}="onTouchStart" ${adapter[platform].touchMove}="onTouchMove" ${adapter[platform].touchEnd}="onTouchEnd" ${adapter[platform].touchCancel}="onTouchCancel" ${adapter[platform].tap}="onTap">{{${itemName}.content}}${isLast ? '</view>' : ''}`
  ];

  // Recursion next
  if (!isLast) {
    subContent.splice(3, 0, ...getSubtreeSimple(i + 1, platform));
  }

  // Add custom element
  subContent.push(`<element ${adapter[platform].elseif}="{{${itemName}.type === 'element'}}" in-cover="{{inCover}}" data-private-node-id="{{${itemName}.nodeId}}" data-private-page-id="{{${itemName}.pageId}}" id="{{${itemName}.id}}" class="{{${itemName}.class || ''}}" style="{{${itemName}.style || ''}}" ${adapter[platform].touchStart}="onTouchStart" ${adapter[platform].touchMove}="onTouchMove" ${adapter[platform].touchEnd}="onTouchEnd" ${adapter[platform].touchCancel}="onTouchCancel" ${adapter[platform].tap}="onTap" generic:custom-component="custom-component"></element>`);

  // Add head content & foot content
  const outputContent = [
    `<block ${adapter[platform].for}="{{${!isFirst ? 'item' + (i - 1) + '.' : ''}childNodes}}" ${adapter[platform].key}="nodeId" ${adapter[platform].forItem}="${itemName}">`,
    ...subContent,
    '</block>'
  ];

  // Add prev tag
  if (!isFirst) {
    outputContent.push('</view>');
  }

  return outputContent;
}

/**
 * Get subtree-cover, and generate single loop content
 */
function getSubtreeCoverSimple(i, platform) {
  const itemName = `item${i}`;
  const isLast = i === DOM_SUBTREE_LEVEL;
  const isFirst = i === 1;
  const subContent = [
    `<cover-image ${adapter[platform].if}="{{${itemName}.isImage}}" data-private-node-id="{{${itemName}.nodeId}}" data-private-page-id="{{${itemName}.pageId}}" id="{{${itemName}.id}}" class="{{${itemName}.class || ''}}" style="{{${itemName}.style || ''}}" src="{{${itemName}.src}}" ${adapter[platform].touchStart}="onTouchStart" ${adapter[platform].touchMove}="onTouchMove" ${adapter[platform].touchEnd}="onTouchEnd" ${adapter[platform].touchCancel}="onTouchCancel" ${adapter[platform].tap}="onTap" ${adapter[platform].load}="onImgLoad" ${adapter[platform].error}="onImgError"></cover-image>`,
    `<cover-view ${adapter[platform].elseif}="{{${itemName}.type === 'text' || ${itemName}.isLeaf || ${itemName}.isSimple}}" data-private-node-id="{{${itemName}.nodeId}}" data-private-page-id="{{${itemName}.pageId}}" id="{{${itemName}.id}}" class="{{${itemName}.class || ''}}" style="{{${itemName}.style || ''}}" ${adapter[platform].touchStart}="onTouchStart" ${adapter[platform].touchMove}="onTouchMove" ${adapter[platform].touchEnd}="onTouchEnd" ${adapter[platform].touchCancel}="onTouchCancel" ${adapter[platform].tap}="onTap">{{${itemName}.content}}${isLast ? '</cover-view>' : ''}`
  ];

  // Recursion next
  if (!isLast) {
    subContent.splice(2, 0, ...getSubtreeCoverSimple(i + 1, platform));
  }

  // Add custom element
  subContent.push(`<element ${adapter[platform].elseif}="{{${itemName}.type === 'element'}}" in-cover="{{true}}" data-private-node-id="{{${itemName}.nodeId}}" data-private-page-id="{{${itemName}.pageId}}" id="{{${itemName}.id}}" class="{{${itemName}.class || ''}}" style="{{${itemName}.style || ''}}" ${adapter[platform].touchStart}="onTouchStart" ${adapter[platform].touchMove}="onTouchMove" ${adapter[platform].touchEnd}="onTouchEnd" ${adapter[platform].touchCancel}="onTouchCancel" ${adapter[platform].tap}="onTap" generic:custom-component="custom-component"></element>`);

  // Add head and foot
  const outputContent = [
    `<block ${adapter[platform].for}="{{${!isFirst ? 'item' + (i - 1) + '.' : ''}childNodes}}" ${adapter[platform].key}="nodeId" ${adapter[platform].forItem}="${itemName}">`,
    ...subContent,
    '</block>'
  ];

  // Add prev close tag
  if (!isFirst) {
    outputContent.push('</cover-view>');
  }

  return outputContent;
}

/**
 * Generate template/subtree (for wechat)
 */
function createSubtreeTemplate(templatePath, platform) {
  const content = [
    '<template name="subtree">',
    ...getSubtreeSimple(1, platform),
    '</template>'
  ];

  // Write file
  fs.writeFileSync(path.join(templatePath, `subtree.${adapter[platform].xml}`), content.join(''), 'utf8');
}

/**
 * Generate src/template/subtree-cover (for wechat)
 */
function createSubtreeCoverTemplate(templatePath, platform) {
  const content = [
    '<template name="subtree-cover">',
    ...getSubtreeCoverSimple(1, platform),
    '</template>'
  ];

  // Write file
  fs.writeFileSync(path.join(templatePath, `subtree-cover.${adapter[platform].xml}`), content.join(''), 'utf8');
}

/**
 * Generate subtree or subtree-cover custom component (for alipay)
 */
function createSubtreeCustomComponent(type = 'subtree', customComponentPath, platform) {
  const content = type === 'subtree' ? getSubtreeSimple(1, platform) : getSubtreeCoverSimple(1, platform);

  // Write file
  const xmlPath = path.join(customComponentPath, `index.${adapter[platform].xml}`);
  const jsPath = path.join(customComponentPath, 'index.js');
  const jsonPath = path.join(customComponentPath, 'index.json');

  fs.writeFileSync(xmlPath, content.join(''), 'utf8');
  fs.writeFileSync(jsPath, CUSTOM_COMPONENT_CONTENT[type].jsContent, 'utf8');
  fs.writeFileSync(jsonPath, CUSTOM_COMPONENT_CONTENT[type].jsonContent, 'utf8');
}

/**
 * Generate subtree cover custom component (for alipay)
 */
function createSubtreeCoverCustomComponent(customComponentPath, platform) {
  const content = getSubtreeCoverSimple(1, platform)

  // Write file
  const xmlPath = path.join(customComponentPath, `index.${adapter[platform].xml}`);
  const jsPath = path.join(customComponentPath, 'index.js');
  const jsonPath = path.join(customComponentPath, 'index.json');

  fs.writeFileSync(xmlPath, content.join(''), 'utf8');
  fs.writeFileSync(jsPath, `Component({
    props: {
      childNodes: []
    }
  })`, 'utf8');
  fs.writeFileSync(jsonPath, `{
    "component": true,
    "usingComponents": {
      "element": "../../index",
      "subtree": "../subtree/index",
      "subtree-cover": "./index"
    }
  }
  `, 'utf8');
}

export default function (distPath, platform) {
  const templatePath = path.join(distPath, 'template');
  fs.ensureDirSync(templatePath);

  switch(platform) {
    case 'ali':
      const subtreePath = path.join(templatePath, 'subtree');
      const subtreeCoverPath = path.join(templatePath, 'subtree-cover');
      fs.ensureDirSync(subtreePath);
      fs.ensureDirSync(subtreeCoverPath);

      createSubtreeCustomComponent('subtree', subtreePath, platform);
      createSubtreeCustomComponent('subtreeCover', subtreeCoverPath, platform);
      break;
    case 'wechat':
      createSubtreeTemplate(templatePath, platform);
      createSubtreeCoverTemplate(templatePath, platform);
      break;
    default:
  }
}
