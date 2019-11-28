# rax-document

Provide components for building Document.

## Usage

```jsx
import { createElement } from 'rax';
import { Document, Root, Data, Styles, Scripts } from 'rax-document';

export default function(props) {
  return (
    <Document {...props}>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1"/>
          <title>ssr-document-demo</title>
          <Styles />
        </head>
        <body>
          {/* root container */}
          <Root />
          {/* initial data from server side */}
          <Data />
          <Scripts />
        </body>
      </html>
    </Document>
  );
}
```

## Components

`Document`

Provide context for the following Components.

`Styles`

Styles for page. Automatic analyzed from your project.

`Scripts`

Scripts for page. Automatic analyzed from your project.

`Root`

Root container for page. In normal Web app, it will be an empty node. In SSR project, the initial HTML will be output in this node.

`Data`

Initial data from server side. Required only in SSR project.

`DangerouslySetInlineStyle`

Component for write inline style.

```jsx
<DangerouslySetInlineStyle>{`
  body {
    background: #f00
  }
`}</DangerouslySetInlineStyle>
```

This is a replacement for using `dangerouslySetInnerHTML`. The above code is equivalent to :

```jsx
<style dangerouslySetInnerHTML={{__html: `
  body {
    background: #f00
  }
`}} />
```

`DangerouslySetInlineScript`

Component for write inline script.

```jsx
<DangerouslySetInlineScript>{`
  alert('hello');
`}</DangerouslySetInlineScript>
```

This is an replacement for using `dangerouslySetInnerHTML`. The above code is equivalent to :

```jsx
<script dangerouslySetInnerHTML={{__html: `
  alert('hello');
`}} />
```
