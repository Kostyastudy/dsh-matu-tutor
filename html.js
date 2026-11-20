/**
 * Small dependency-free HTML reader for the APTAT pages.
 * The site is old JSP with nested tables and no client-side rendering, so a
 * forgiving tree parser is enough and avoids adding a package dependency.
 */

const VOID = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link',
  'meta', 'param', 'source', 'track', 'wbr',
])

const BLOCK = new Set([
  'address', 'article', 'aside', 'blockquote', 'div', 'dl', 'fieldset',
  'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5',
  'h6', 'header', 'hr', 'li', 'main', 'nav', 'ol', 'p', 'pre', 'section',
  'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'ul',
])

const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  copy: '©', reg: '®', hellip: '…', mdash: '—', ndash: '–',
  ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’', middot: '·',
  times: '×', divide: '÷', deg: '°', plusmn: '±',
}

export function decodeEntities(value) {
  return String(value).replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]+);/g, (all, body) => {
    if (body[0] === '#') {
      const hex = body[1] === 'x' || body[1] === 'X'
      const code = Number.parseInt(body.slice(hex ? 2 : 1), hex ? 16 : 10)
      if (Number.isFinite(code)) {
        try { return String.fromCodePoint(code) } catch { return all }
      }
      return all
    }
    return Object.prototype.hasOwnProperty.call(ENTITIES, body) ? ENTITIES[body] : all
  })
}

function parseAttributes(raw) {
  const attrs = {}
  const re = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g
  let m
  while ((m = re.exec(raw))) {
    const name = m[1].toLowerCase()
    if (name === '/' || name === '') continue
    attrs[name] = decodeEntities(m[2] ?? m[3] ?? m[4] ?? '')
  }
  return attrs
}

function makeNode(tag, attrs = {}) {
  return { tag, attrs, children: [], parent: null }
}

/**
 * @param {string} html
 * @returns {{tag:'#root', attrs:Record<string,string>, children:any[]}}
 */
export function parseHtml(html) {
  const cleaned = String(html)
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '')

  const root = makeNode('#root')
  const stack = [root]
  const token = /<\/?([a-zA-Z][\w:-]*)((?:"[^"]*"|'[^']*'|[^'">])*)\/?>|([^<]+)/g
  let m

  const top = () => stack[stack.length - 1]
  const append = (node) => {
    node.parent = top()
    top().children.push(node)
  }
  const closeTo = (tag) => {
    for (let i = stack.length - 1; i >= 1; i -= 1) {
      if (stack[i].tag === tag) {
        stack.length = i
        return
      }
    }
  }
  const autoClose = (tag) => {
    const current = top().tag
    if ((tag === 'td' || tag === 'th') && (current === 'td' || current === 'th')) {
      stack.pop()
    } else if (tag === 'tr' && (current === 'td' || current === 'th')) {
      stack.pop()
    } else if (tag === 'tr' && current === 'tr') {
      stack.pop()
    } else if (tag === 'li' && current === 'li') {
      stack.pop()
    } else if (tag === 'p' && current === 'p') {
      stack.pop()
    }
  }

  while ((m = token.exec(cleaned))) {
    if (m[3] !== undefined) {
      if (m[3]) append({ tag: '#text', text: decodeEntities(m[3]) })
      continue
    }
    const whole = m[0]
    const tag = (m[1] || '').toLowerCase()
    if (!tag) continue
    if (whole.startsWith('</')) {
      closeTo(tag)
      continue
    }
    autoClose(tag)
    const node = makeNode(tag, parseAttributes(m[2] || ''))
    append(node)
    if (!VOID.has(tag) && !/\/\s*>$/.test(whole)) stack.push(node)
  }
  return root
}

export function findAll(node, predicate) {
  const out = []
  const walk = (current) => {
    for (const child of current.children || []) {
      if (child.tag === '#text') continue
      if (predicate(child)) out.push(child)
      walk(child)
    }
  }
  walk(node)
  return out
}

export function find(node, predicate) {
  for (const child of node.children || []) {
    if (child.tag === '#text') continue
    if (predicate(child)) return child
    const nested = find(child, predicate)
    if (nested) return nested
  }
  return null
}

export function findByTag(node, tag) {
  return find(node, (n) => n.tag === tag)
}

export function findAllByTag(node, tag) {
  return findAll(node, (n) => n.tag === tag)
}

export function textOf(node, options = {}) {
  if (!node) return ''
  if (node.tag === '#text') {
    const value = node.text || ''
    return (options.preserveWhitespace || options.raw) ? value : value.replace(/\s+/g, ' ')
  }
  if (node.tag === 'br') return '\n'
  const parts = []
  for (const child of node.children || []) {
    parts.push(textOf(child, options))
  }
  const body = parts.join('')
  if (options.raw) return body
  if (node.tag === 'pre' || options.preserveWhitespace) return body.replace(/^\n+|\n+$/g, '')
  if (BLOCK.has(node.tag)) {
    return body
      .replace(/[ \t\f\v]+/g, ' ')
      .replace(/\s*\n\s*/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  }
  return body.replace(/[ \t\f\v]+/g, ' ')
}

export function textLines(node) {
  return textOf(node, { raw: true })
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export function directChildren(node, tag) {
  return (node.children || []).filter((child) => child.tag === tag)
}

export function directCells(row) {
  return (row.children || []).filter((child) => child.tag === 'td' || child.tag === 'th')
}

export function attr(node, name) {
  return node && node.attrs ? (node.attrs[name] || '') : ''
}

export function findLink(node, fragment) {
  return find(node, (n) => {
    if (n.tag !== 'a') return false
    return attr(n, 'href').includes(fragment)
  })
}

export function rowsOf(root) {
  return findAllByTag(root, 'tr')
}

export function classList(node) {
  return attr(node, 'class').split(/\s+/).filter(Boolean)
}
