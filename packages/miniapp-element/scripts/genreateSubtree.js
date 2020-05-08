import path from 'path';
import fs from 'fs-extra';
import adapter from './adapter';

const DOM_SUBTREE_LEVEL = 10;

/**
 * Get subtree, to generate single loop content
 */
function getSubtreeSimple(i, platform) {
  const itemName = `item${i}`;
  const isLast = i === DOM_SUBTREE_LEVEL;
  const isFirst = i === 1;
  const subContent = [
    `<block ${adapter[platform].if}="{{${itemName}.type === 'text'}}">{{${itemName}.content}}</block>`,
    `<image ${adapter[platform].elseif}="{{${itemName}.isImage}}" data-private-node-id="{{${itemName}.nodeId}}" data-private-page-id="{{${itemName}.pageId}}" id="{{${itemName}.id}}" class="{{${itemName}.class || ''}}" style="{{${itemName}.style || ''}}" src="{{${itemName}.src}}" animation="{{${itemName}.animation}}"  rendering-mode="{{${itemName}.mode ? 'backgroundImage' : 'img'}}" mode="{{${itemName}.mode}}" lazy-load="{{${itemName}.lazyLoad}}" show-menu-by-longpress="{{${itemName}.showMenuByLongpress}}" ${adapter[platform].touchStart}="onTouchStart" ${adapter[platform].touchMove}="onTouchMove" ${adapter[platform].touchEnd}="onTouchEnd" ${adapter[platform].touchCancel}="onTouchCancel" ${adapter[platform].tap}="onTap" ${adapter[platform].load}="onImgLoad" ${adapter[platform].error}="onImgError"></image>`,
    `<view ${adapter[platform].elseif}="{{${itemName}.isLeaf${isLast ? '' : ' || ' + itemName + '.isSimple'}}}" data-private-node-id="{{${itemName}.nodeId}}" data-private-page-id="{{${itemName}.pageId}}" id="{{${itemName}.id}}" class="{{${itemName}.class || ''}}" style="{{${itemName}.style || ''}}" animation="{{${itemName}.animation}}" ${adapter[platform].touchStart}="onTouchStart" ${adapter[platform].touchMove}="onTouchMove" ${adapter[platform].touchEnd}="onTouchEnd" ${adapter[platform].touchCancel}="onTouchCancel" ${adapter[platform].tap}="onTap">{{${itemName}.content}}${isLast ? '</view>' : ''}`
  ];

  // Recursion next
  if (!isLast) {
    subContent.splice(3, 0, ...getSubtreeSimple(i + 1, platform));
  }

  // Add custom element
  subContent.push(`<element ${adapter[platform].elseif}="{{${itemName}.type === 'element'}}" in-cover="{{inCover}}" data-private-node-id="{{${itemName}.nodeId}}" data-private-page-id="{{${itemName}.pageId}}" id="{{${itemName}.id}}" class="{{${itemName}.class || ''}}" style="{{${itemName}.style || ''}}" animation="{{${itemName}.animation}}" ${adapter[platform].touchStart}="onTouchStart" ${adapter[platform].touchMove}="onTouchMove" ${adapter[platform].touchEnd}="onTouchEnd" ${adapter[platform].touchCancel}="onTouchCancel" ${adapter[platform].tap}="onTap" ${adapter[platform].supportComponentGenerics ? 'generic:custom-component="custom-component"' : ''}></element>`);

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
    `<cover-image ${adapter[platform].if}="{{${itemName}.isImage}}" data-private-node-id="{{${itemName}.nodeId}}" data-private-page-id="{{${itemName}.pageId}}" id="{{${itemName}.id}}" class="{{${itemName}.class || ''}}" style="{{${itemName}.style || ''}}" animation="{{${itemName}.animation}}" src="{{${itemName}.src}}" ${adapter[platform].touchStart}="onTouchStart" ${adapter[platform].touchMove}="onTouchMove" ${adapter[platform].touchEnd}="onTouchEnd" ${adapter[platform].touchCancel}="onTouchCancel" ${adapter[platform].tap}="onTap" ${adapter[platform].load}="onImgLoad" ${adapter[platform].error}="onImgError"></cover-image>`,
    `<cover-view ${adapter[platform].elseif}="{{${itemName}.type === 'text' || ${itemName}.isLeaf || ${itemName}.isSimple}}" data-private-node-id="{{${itemName}.nodeId}}" data-private-page-id="{{${itemName}.pageId}}" id="{{${itemName}.id}}" class="{{${itemName}.class || ''}}" style="{{${itemName}.style || ''}}" animation="{{${itemName}.animation}}" ${adapter[platform].touchStart}="onTouchStart" ${adapter[platform].touchMove}="onTouchMove" ${adapter[platform].touchEnd}="onTouchEnd" ${adapter[platform].touchCancel}="onTouchCancel" ${adapter[platform].tap}="onTap">{{${itemName}.content}}${isLast ? '</cover-view>' : ''}`
  ];

  // Recursion next
  if (!isLast) {
    subContent.splice(2, 0, ...getSubtreeCoverSimple(i + 1, platform));
  }

  // Add custom element
  subContent.push(`<element ${adapter[platform].elseif}="{{${itemName}.type === 'element'}}" in-cover="{{true}}" data-private-node-id="{{${itemName}.nodeId}}" data-private-page-id="{{${itemName}.pageId}}" id="{{${itemName}.id}}" class="{{${itemName}.class || ''}}" style="{{${itemName}.style || ''}}" animation="{{${itemName}.animation}}" ${adapter[platform].touchStart}="onTouchStart" ${adapter[platform].touchMove}="onTouchMove" ${adapter[platform].touchEnd}="onTouchEnd" ${adapter[platform].touchCancel}="onTouchCancel" ${adapter[platform].tap}="onTap" ${adapter[platform].supportComponentGenerics ? 'generic:custom-component="custom-component"' : ''}></element>`);

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
function createSubtreeTemplate(platform) {
  const content = [
    '<template name="subtree">',
    ...getSubtreeSimple(1, platform),
    '</template>',
    '\n'
  ];
  return content.join('');
}

/**
 * Generate src/template/subtree-cover (for wechat)
 */
function createSubtreeCoverTemplate(platform) {
  const content = [
    '<template name="subtree-cover">',
    ...getSubtreeCoverSimple(1, platform),
    '</template>',
    '\n'
  ];
  return content.join('');
}

export default function(distPath, platform) {
  switch (platform) {
    case 'ali':
      const subtreeAXMLTemplate = createSubtreeTemplate(platform);
      const subtreeCoverAXMLTemplate = createSubtreeCoverTemplate(platform);
      const XMLPath = path.join(distPath, 'index.axml');
      fs.appendFileSync(XMLPath, subtreeAXMLTemplate);
      fs.appendFileSync(XMLPath, subtreeCoverAXMLTemplate);
      break;
    case 'wechat':
      const subtreeWXMLTemplate = createSubtreeTemplate(platform);
      const subtreeCoverWXMLTemplate = createSubtreeCoverTemplate(platform);
      const templatePath = path.join(distPath, 'template');
      fs.ensureDirSync(templatePath);
      fs.writeFileSync(path.join(templatePath, `subtree.${adapter[platform].xml}`), subtreeWXMLTemplate, 'utf8');
      fs.writeFileSync(path.join(templatePath, `subtree-cover.${adapter[platform].xml}`), subtreeCoverWXMLTemplate, 'utf8');
      break;
    default:
  }
}
