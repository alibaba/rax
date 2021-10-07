import escapeText from '../escapeText';

describe('escapeText', () => {
  it('should escape boolean to string', function() {
    expect(escapeText(true)).toBe('true');
    expect(escapeText(false)).toBe('false');
  });

  it('should escape object to string', function() {
    let escaped = escapeText({
      toString: function() {
        return 'ponys';
      },
    });

    expect(escaped).toBe('ponys');
  });

  it('should escape number to string', function() {
    expect(escapeText(42)).toBe('42');
  });

  it('should escape string', function() {
    let escaped = escapeText('<script type=\'\' src=""></script>');
    expect(escaped).not.toContain('<');
    expect(escaped).not.toContain('>');
    expect(escaped).not.toContain('\'');
    expect(escaped).not.toContain('\"');

    escaped = escapeText('&');
    expect(escaped).toBe('&amp;');
  });
});
