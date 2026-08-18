#!/usr/bin/env python3
"""Transcribe bijlesbeta.nl's kennisbank posts into `ArticleBlock` TypeScript.

    python3 scripts/import-kennisbank.py <wordpress-export.xml> [slug ...]

Prints, for each post in the WordPress export, the `body: [...]` literal to
paste into that article's entry in `app/data/kennisbank.ts`. Give one or more
WordPress slugs to limit it to those posts.

This exists because the eighteen live articles are transcribed rather than
retyped, and the transcription is not a copy-paste: the WordPress post is a
mixture of loose copy, hand-written HTML and `$…$` / `$$…$$` LaTeX for the
QuickLaTeX plugin, and turning it into blocks means reproducing what WordPress
itself does to that source — `wpautop` for the paragraphs and line breaks,
`wptexturize` for the dashes and quotes — before the LaTeX is pulled out.
Doing that by hand across ~590 blocks is how mistakes get in.

It does *not* write the file. Metadata (title, tags, excerpt, author, dates,
reading time) is not in scope: `readingMinutes` and `wordCount` come from the
live page's `Leestijd:` line, and everything else is already correct in
`app/data/kennisbank.ts`. Only the body is mechanical enough to generate.

Two live bugs are corrected on the way through rather than reproduced; both are
noted in CLAUDE.md under "The kennisbank articles, and their maths".
"""

import html
import re
import sys
import xml.etree.ElementTree as ET


BLOCK_TAGS = 'h1|h2|h3|h4|h5|h6|ul|ol|table|blockquote|pre|figure'
VOID_TAGS = 'hr|img'


def texturize(t):
    """The part of WordPress' wptexturize that shows up in this copy: em and en
    dashes, curly quotes and the ellipsis. Applied to prose only, never to the
    LaTeX between the dollars."""
    t = t.replace('---', '\u2014').replace('--', '\u2013')
    t = t.replace('...', '\u2026')
    t = re.sub(r'"([^"]*)"', '\u201c\\1\u201d', t)
    t = re.sub(r"(?<=\w)'(?=\w)", '\u2019', t)
    t = re.sub(r"'(?=\d\d\b)", '\u2019', t)
    return t

# ---------------------------------------------------------------- inline runs

def tokenize_tex(s):
    """Split a string on $$…$$ and $…$, yielding ('text', str) / ('tex', str)."""
    out = []
    i = 0
    while i < len(s):
        if s.startswith('$$', i):
            j = s.find('$$', i + 2)
            if j == -1:
                out.append(('text', s[i:])); break
            out.append(('tex', s[i+2:j])); i = j + 2
        elif s[i] == '$':
            j = s.find('$', i + 1)
            if j == -1:
                out.append(('text', s[i:])); break
            out.append(('tex', s[i+1:j])); i = j + 1
        else:
            nxt = s.find('$', i)
            if nxt == -1:
                out.append(('text', s[i:])); break
            out.append(('text', s[i:nxt])); i = nxt
    return [(k, v) for k, v in out if v != '']


def clean_tex(tex):
    """A formula is LaTeX, not markup: drop the `<br />`s the editor dropped in
    and collapse the wrapping so multi-line sources render as one expression."""
    tex = re.sub(r'(?is)<[^>]+>', ' ', tex)
    tex = re.sub(r'\s+', ' ', html.unescape(tex)).strip()
    # `&` only means something inside an alignment environment. One article
    # writes `&=` in bare `$$…$$`, which QuickLaTeX renders as an error image
    # on the live page; dropping the marker renders the equation the author
    # meant.
    if '\\begin{' not in tex:
        tex = tex.replace('&', '')
    return re.sub(r'\s+', ' ', tex).strip()


def inline_runs(frag, style=None, top=True):
    """Parse an inline HTML fragment into a list of Run dicts.

    Only the outermost call trims: a space at the end of a `<span>` is a space
    between two words, not padding."""
    frag = re.sub(r'(?is)</?(p|div|hr)\b[^>]*>', '', frag)
    style = style or {}
    runs = []

    def emit_text(t):
        if not t:
            return
        for kind, val in tokenize_tex(t):
            if kind == 'tex':
                runs.append({'tex': clean_tex(val)})
                continue
            # A single newline is a <br> once WordPress' wpautop has run, so it
            # is a line break inside the paragraph rather than a new one.
            for k, piece in enumerate(re.split(r'\n', html.unescape(val).replace('\xa0', ' '))):
                if k:
                    runs.append({'br': True})
                txt = texturize(re.sub(r'[ \t]+', ' ', piece))
                if not txt:
                    continue
                # Whitespace between two styled runs belongs to neither of them.
                runs.append({'text': txt} if not txt.strip() else
                            (dict(style, text=txt) if style else {'text': txt}))

    pos = 0
    pattern = re.compile(
        r'(?is)<(strong|b|em|i|sub|sup|a|span|br)\b([^>]*)>(?:(.*?)</\1>)?', re.S)
    while pos < len(frag):
        m = pattern.search(frag, pos)
        if not m:
            emit_text(frag[pos:]); break
        emit_text(frag[pos:m.start()])
        tag, attrs, inner = m.group(1).lower(), m.group(2) or '', m.group(3)
        if tag == 'br':
            runs.append({'br': True})
            pos = m.end(); continue
        inner = inner or ''
        nested = dict(style)
        if tag in ('strong', 'b'): nested['bold'] = True
        elif tag in ('em', 'i'):   nested['em'] = True
        elif tag == 'sub':         nested['sub'] = True
        elif tag == 'sup':         nested['sup'] = True
        elif tag == 'a':
            href = re.search(r'href="([^"]*)"', attrs)
            if href: nested['link'] = html.unescape(href.group(1))
        runs.extend(inline_runs(inner, nested, top=False))
        pos = m.end()

    # Merge adjacent runs with identical styling, drop empties.
    merged = []
    for r in runs:
        if 'tex' in r or 'br' in r:
            merged.append(r); continue
        key = {k: v for k, v in r.items() if k != 'text'}
        if merged and 'tex' not in merged[-1] and 'br' not in merged[-1] and {k: v for k, v in merged[-1].items() if k != 'text'} == key:
            merged[-1] = dict(merged[-1], text=merged[-1]['text'] + r['text'])
        else:
            merged.append(r)
    out = []
    for r in merged:
        if 'tex' in r or 'br' in r:
            out.append(r)
        elif r.get('text'):
            out.append(r)
    if top:
        while out and 'br' in out[0]:
            out.pop(0)
        while out and 'br' in out[-1]:
            out.pop()
    # Trim outer whitespace.
    if top:
        if out and 'tex' not in out[0] and 'br' not in out[0] and not out[0].get('link'):
            out[0] = dict(out[0], text=out[0]['text'].lstrip())
        if out and 'tex' not in out[-1] and 'br' not in out[-1] and not out[-1].get('link'):
            out[-1] = dict(out[-1], text=out[-1]['text'].rstrip())
    return [r for r in out if 'tex' in r or 'br' in r or r.get('text')]


def plain(frag):
    """Inline fragment to plain text (for headings and table header cells)."""
    s = re.sub(r'(?is)<[^>]+>', '', frag)
    return re.sub(r'\s+', ' ', html.unescape(s).replace('\xa0', ' ')).strip()

# ---------------------------------------------------------------- block split

def paragraphs_from_text(text):
    """Turn a run of loose copy into paragraph and formula blocks.

    Blank lines separate paragraphs (wpautop). `$$…$$` is always a displayed
    equation, which is how QuickLaTeX renders it, so it ends the paragraph it
    sits in and opens a new one after itself."""
    blocks = []
    for chunk in re.split(r'\n\s*\n', text):
        if not chunk.strip():
            continue
        for part in re.split(r'(?s)(\$\$.*?\$\$)', chunk):
            m = re.fullmatch(r'(?s)\$\$(.*?)\$\$', part)
            if m:
                blocks.append({'type': 'formula', 'tex': clean_tex(m.group(1))})
                continue
            if not part.strip():
                continue
            runs = inline_runs(part)
            if runs:
                blocks.append({'type': 'paragraph', 'text': runs})
    return blocks


def split_items(inner):
    """Top-level <li> fragments, so a nested <ul>/<ol> stays with its parent."""
    items, depth, start, i = [], 0, None, 0
    for m in re.finditer(r'(?is)<(/?)(li|ul|ol)\b[^>]*?(/?)>', inner):
        tag, closing = m.group(2).lower(), bool(m.group(1))
        if tag == 'li':
            if not closing:
                if depth == 0:
                    start = m.end()
                depth += 1
            else:
                depth -= 1
                if depth == 0 and start is not None:
                    items.append(inner[start:m.start()]); start = None
    if start is not None:
        items.append(inner[start:])
    return items


def parse_list(tag, inner):
    items = []
    for frag in split_items(inner):
        nested = re.search(r'(?is)<(ul|ol)\b[^>]*>(.*)</\1>', frag)
        if nested:
            text = inline_runs(frag[:nested.start()])
            child = parse_list(nested.group(1).lower(), nested.group(2))
            if text or child['items']:
                items.append({'text': text, 'children': child})
        else:
            runs = inline_runs(frag)
            if runs:
                items.append(runs)
    block = {'type': 'list', 'items': items}
    if tag == 'ol':
        block['ordered'] = True
    return block


def parse_table(frag):
    rows = re.findall(r'(?is)<tr\b[^>]*>(.*?)</tr>', frag)
    parsed = []
    for r in rows:
        cells = [(t.group(1).lower(), t.group(2))
                 for t in re.finditer(r'(?is)<(t[dh])\b[^>]*>(.*?)</\1>', r)]
        parsed.append(cells)
    if not parsed:
        return None
    head, body = parsed[0], parsed[1:]
    columns = [plain(c[1]) for c in head]
    out_rows = []
    for cells in body:
        out_rows.append({'header': plain(cells[0][1]),
                         'cells': [inline_runs(c[1]) for c in cells[1:]]})
    return {'type': 'table', 'columns': columns, 'rows': out_rows}


def match_close(s, start, tag):
    """End offset of the element opening at `start`, honouring nesting."""
    depth = 0
    for m in re.finditer(r'(?is)<(/?)%s\b[^>]*?(/?)>' % tag, s[start:]):
        if m.group(2):
            continue
        depth += -1 if m.group(1) else 1
        if depth == 0:
            return start + m.end()
    return None


def convert(raw):
    raw = raw.replace('\r\n', '\n')
    raw = re.sub(r'(?is)<script.*?</script>', '', raw)
    raw = raw.replace('[latexpage]', '')
    # Layout-only wrappers the editor left behind; WordPress balances them away.
    raw = re.sub(r'(?is)</?div\b[^>]*>', '', raw)
    # `<hr>` and `<img>` are void; the editor also left unbalanced `<p>` tags
    # behind, which WordPress silently balances and we simply drop.
    raw = re.sub(r'(?is)<hr\b[^>]*>', '<hr />', raw)

    blocks = []
    pos = 0
    pattern = re.compile(
        r'(?is)<(%s)\b([^>]*?)>(.*?)</\1>|<(%s)\b([^>]*?)/?>|<p\b([^>]*)>(.*?)</p>'
        % (BLOCK_TAGS, VOID_TAGS), re.S)
    while True:
        m = pattern.search(raw, pos)
        if not m:
            blocks.extend(paragraphs_from_text(raw[pos:])); break
        blocks.extend(paragraphs_from_text(raw[pos:m.start()]))
        pos = m.end()

        if m.group(4) and m.group(4).lower() == 'hr':
            blocks.append({'type': 'divider'})
            continue
        if m.group(4):  # <img>
            attrs = m.group(5)
            src = re.search(r'src="([^"]*)"', attrs)
            alt = re.search(r'alt="([^"]*)"', attrs)
            blocks.append({'type': 'image',
                           'src': html.unescape(src.group(1)) if src else '',
                           'alt': html.unescape(alt.group(1)) if alt else ''})
            continue
        if m.group(6) is not None:  # <p>
            blocks.extend(paragraphs_from_text(m.group(7) or ''))
            continue

        tag, inner = m.group(1).lower(), (m.group(3) or '')
        if tag in ('ul', 'ol'):
            # A list can nest, so take its own closing tag rather than the first.
            end = match_close(raw, m.start(), tag)
            if end is not None:
                whole = raw[m.start():end]
                inner = whole[whole.index('>') + 1:whole.rindex('</')]
                pos = end
            blocks.append(parse_list(tag, inner))
        elif re.fullmatch(r'h[1-6]', tag):
            blocks.append({'type': 'heading',
                           'level': min(max(int(tag[1]), 2), 4),
                           'text': plain(inner)})
        elif tag == 'table':
            t = parse_table(inner)
            if t: blocks.append(t)
        else:
            blocks.extend(paragraphs_from_text(inner))
    return blocks


# WordPress slug -> this app's slug. WordPress nests posts under a category
# segment we don't use, and ten were shortened as well; see `redirects.ts`,
# which carries the same pairing as 301s.
SLUGMAP = {
    'statistiek-werken-met-de-kruistabel': 'kruistabel',
    'statistiek-werken-met-de-effectgrootte': 'effectgrootte',
    'substitutie-eerst-denken-dan-doen': 'substitutie',
    'lineaire-verbanden-waar-het-misgaat-op-de-toets': 'lineaire-verbanden',
    'rekenen-met-procenten': 'rekenen-met-procenten',
    'exponentiele-verbanden-wat-gebeurt-er-als-de-tijd-verandert': 'exponentiele-verbanden',
    'afgeleide-functies-wat-betekent-dat-eigenlijk': 'afgeleide-functies',
    'technieken-voor-differentieren': 'technieken-voor-differentieren',
    'het-periodiek-systeem-verdiepende-vragen-en-uitwerkingen': 'periodiek-systeem',
    'zouten-molecuulformules-en-oplosreacties': 'zouten',
    'radioactief-verval': 'radioactief-verval',
    'ph-berekeningen': 'ph-berekeningen',
    'molberekeningen': 'molberekeningen',
    'snelheid-en-versnelling': 'snelheid-en-versnelling',
    'reactievergelijkingen': 'reactievergelijkingen',
    'elektromagnetisch-spectrum': 'elektromagnetisch-spectrum',
    'de-drie-wetten-van-netwon-stap-voor-stap': 'wetten-van-newton',
    'oefenvraag-halveringstijd-terug-naar-tsjernobyl-hoe-lang-blijft-jodium-131-gevaarlijk':
        'halveringstijd-tsjernobyl',
}

slugmap = SLUGMAP




IMG_REWRITE = {
    'https://bijlesbeta.nl/wp-content/uploads/2025/12/periodiek_systeem-300x156.jpg':
        '/img/kennisbank/periodiek-systeem-tabel.jpg',
}

# Links out of the article body onto this app's own routes. Everything the
# WordPress copy points at either moved slug or lost its category segment.
LINK_REWRITE = {}
for wp, ours in slugmap.items():
    for cat in ('examenstof', 'havo-5', 'natuurkunde', 'scheikunde', 'wiskunde',
                'wiskunde-a', 'statistiek'):
        LINK_REWRITE['https://bijlesbeta.nl/kennisbank/%s/%s/' % (cat, wp)] = '/kennisbank/%s' % ours
LINK_REWRITE.update({
    'https://bijlesbeta.nl/aanmelden/': '/aanmelden',
    'https://bijlesbeta.nl/examentraining-groningen/': '/examentraining',
    'https://bijlesbeta.nl/contact/': '/contact',
    'https://bijlesbeta.nl/tarieven/': '/tarieven',
    'https://bijlesbeta.nl/': '/',
    'https://bijlesbeta.nl': '/',
})

unmapped = set()


def q(s):
    """A TypeScript single-quoted string literal."""
    return "'" + s.replace('\\', '\\\\').replace("'", "\\'") + "'"


def qt(s):
    """A LaTeX literal; backslash-heavy, so prefer a raw-ish single-quoted form."""
    return q(s)


def run(r):
    if 'tex' in r:
        return 'tex(%s)' % qt(r['tex'])
    if 'br' in r:
        return 'br'
    t, text = r, r['text']
    styles = [k for k in ('bold', 'em', 'sub', 'sup') if t.get(k)]
    if t.get('link'):
        href = t['link']
        if href in LINK_REWRITE:
            href = LINK_REWRITE[href]
        elif href.startswith('https://bijlesbeta.nl'):
            unmapped.add(href)
        if styles:
            return '{ text: %s, %s, link: %s }' % (
                q(text), ', '.join('%s: true' % s for s in styles), q(href))
        return 'link(%s, %s)' % (q(text), q(href))
    if len(styles) == 1:
        return '%s(%s)' % ({'bold': 'strong', 'em': 'em', 'sub': 'sub', 'sup': 'sup'}[styles[0]], q(text))
    if styles:
        return '{ text: %s, %s }' % (q(text), ', '.join('%s: true' % s for s in styles))
    return q(text)


def runs(rs, indent):
    parts = [run(r) for r in rs]
    one = '[' + ', '.join(parts) + ']'
    if len(one) + indent <= 108 and '\n' not in one:
        return one
    pad = ' ' * (indent + 2)
    return '[\n' + ''.join('%s%s,\n' % (pad, p) for p in parts) + ' ' * indent + ']'


def emit_list(block, indent):
    pad = ' ' * indent
    inner = ' ' * (indent + 2)
    out = pad + '{\n' + inner + "type: 'list',\n"
    if block.get('ordered'):
        out += inner + 'ordered: true,\n'
    out += inner + 'items: [\n'
    for item in block['items']:
        item_pad = ' ' * (indent + 4)
        if isinstance(item, dict):
            out += item_pad + '{\n'
            out += item_pad + '  text: ' + runs(item['text'], indent + 8) + ',\n'
            out += item_pad + '  children: ' + emit_list(item['children'], indent + 4).lstrip() + ',\n'
            out += item_pad + '},\n'
        else:
            out += item_pad + runs(item, indent + 4) + ',\n'
    out += inner + '],\n' + pad + '}'
    return out


def emit_block(b, indent=6):
    pad = ' ' * indent
    inner = ' ' * (indent + 2)
    t = b['type']
    if t == 'heading':
        level = b.get('level', 2)
        lvl = '' if level == 2 else 'level: %d, ' % level
        return pad + "{ type: 'heading', %stext: %s }" % (lvl, q(b['text']))
    if t == 'paragraph':
        one = pad + "{ type: 'paragraph', text: " + runs(b['text'], indent + 26) + ' }'
        if '\n' not in one:
            return one
        parts = [run(r) for r in b['text']]
        return (pad + '{\n' + inner + "type: 'paragraph',\n" + inner + 'text: [\n'
                + ''.join('%s  %s,\n' % (inner, p) for p in parts)
                + inner + '],\n' + pad + '}')
    if t == 'formula':
        return pad + 'formula(%s)' % qt(b['tex'])
    if t == 'divider':
        return pad + "{ type: 'divider' }"
    if t == 'image':
        src = IMG_REWRITE.get(b['src'], b['src'])
        return pad + "{ type: 'image', src: %s, alt: %s }" % (q(src), q(b['alt']))
    if t == 'list':
        return emit_list(b, indent)
    if t == 'table':
        out = pad + '{\n' + inner + "type: 'table',\n"
        out += inner + 'columns: [' + ', '.join(q(c) for c in b['columns']) + '],\n'
        out += inner + 'rows: [\n'
        for r in b['rows']:
            out += ' ' * (indent + 4) + '{ header: %s, cells: [%s] },\n' % (
                q(r['header']), ', '.join(runs(c, indent + 8) for c in r['cells']))
        out += inner + '],\n' + pad + '}'
        return out
    raise ValueError(t)


NS = {
    'wp': 'http://wordpress.org/export/1.2/',
    'content': 'http://purl.org/rss/1.0/modules/content/',
}


def main(argv):
    if len(argv) < 2:
        sys.exit(__doc__)
    wanted = set(argv[2:])
    tree = ET.parse(argv[1])
    for item in tree.getroot().iter('item'):
        get = lambda p: (item.findtext(p, default='', namespaces=NS) or '')
        if get('wp:post_type') != 'post' or get('wp:status') != 'publish':
            continue
        wp_slug = get('wp:post_name')
        if wanted and wp_slug not in wanted:
            continue
        body = convert(get('content:encoded'))
        print('  // %s -> /kennisbank/%s' % (wp_slug, SLUGMAP.get(wp_slug, '?')))
        print('    body: [')
        for block in body:
            print(emit_block(block) + ',')
        print('    ],')
        print()
    if unmapped:
        print('# links off this app that were left absolute:', file=sys.stderr)
        for url in sorted(unmapped):
            print('#   ' + url, file=sys.stderr)


if __name__ == '__main__':
    main(sys.argv)
