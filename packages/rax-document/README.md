# rax-document

Provide components for build `Document` .

## Usage

```jsx
import { createElement } from 'rax';
import { Root, Data, Styles, Scripts } from 'rax-document';

function Document() {
  return (
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
  );
}

export default Document;
```

## Components

`Styles`

Styles for page. Automatic analyzed from your project.

`Scripts`

Scripts for page. Automatic analyzed from your project.

`Root`

Root container for page. In normal Web app, it will be an empty node. In SSR project, the initial HTML will be output in this node.

`Data`

Initial data from server side. Required only in SSR project.

`DangerouslyStyle`

Component for write inline style.

```jsx
<DangerouslyStyle>{`
  body {
    background: #f00
  }
`}</DangerouslyStyle>
```

This is a replacement for using `dangerouslySetInnerHTML`. The above code is equivalent to :

```jsx
<style dangerouslySetInnerHTML={{__html: `
  body {
    background: #f00
  }
`}} />
```

`DangerouslyScript`

Component for write inline script.

```jsx
<DangerouslyScript>{`
  alert('hello');
`}</DangerouslyScript>
```

This is an replacement for using `dangerouslySetInnerHTML`. The above code is equivalent to :

```jsx
<script dangerouslySetInnerHTML={{__html: `
  alert('hello');
`}} />
```