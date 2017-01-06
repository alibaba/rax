import parser from '../parserHTML';

describe('parserHTML', () => {
  it('parser template content', () => {
    const html = '<template><div>hello world</div></template>';
    const template = parser(html).template;

    expect(template.content).toEqual('<div>hello world</div>');
  });

  it('parser style content', () => {
    const html = '<style>.title {color: red;}</style>';
    const style = parser(html).styles;

    expect(style.content).toEqual('.title {color: red;}');
  });

  it('parser script content', () => {
    const html = '<script>const title = "hello world"</script>';
    const script = parser(html).script;

    expect(script.content).toEqual('const title = "hello world"');
  });

  it('parser link content', () => {
    const html = `
<link rel="import" href="index.html" />
<link rel="stylesheet" href="common.css" />
    `;
    const object = parser(html);

    expect(object.importLinks).toEqual(['index.html']);
    expect(object.styleSheetLinks).toEqual(['common.css']);
  });
});
