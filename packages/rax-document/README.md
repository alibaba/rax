# rax-document

Provide components for building Document.

## Usage

```jsx
import { createElement } from 'rax';
import { Root, Data, Style, Script } from 'rax-document';

export default () => {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <title>ssr-document-demo</title>
        <Style />
      </head>
      <body>
        {/* root container */}
        <Root />
        {/* initial data from server side */}
        <Data />
        <Script />
      </body>
    </html>
  );
}
```

## Components

`Style`

Styles for page. Automatic analyzed from your project.

`Script`

Scripts for page. Automatic analyzed from your project.

`Root`

Root container for page. In normal Web app, it will be an empty node. In SSR project, the initial HTML will be output in this node.

`Data`

Initial data from server side. Required only in SSR project.
