# miniapp-element

> Forked from kbone.

## Introduce

Provider custom element to `miniapp-render`.

## Install

```
npm install --save miniapp-element
```

## Usage

```json
{
  "usingComponents": {
    "element": "miniapp-element"
  }
}
```

```html
<element data-private-node-id="{{nodeId}}" data-private-page-id="{{pageId}}"></element>
```

## Properties

| Property | Required | Description                                        |
| -------- | -------- | -------------------------------------------------- |
| pageId   | ✔️        | Find the window/document corresponding to the page |
| nodeId   | ✔️        | Find  the dom corresponding to the node            |
