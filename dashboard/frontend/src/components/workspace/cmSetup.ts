import type { Extension } from '@codemirror/state'
import { EditorState, StateEffect } from '@codemirror/state'
import { EditorView, keymap, lineNumbers, drawSelection, highlightActiveLine } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { markdown } from '@codemirror/lang-markdown'
import { json } from '@codemirror/lang-json'
import { python } from '@codemirror/lang-python'
import { javascript } from '@codemirror/lang-javascript'
import { syntaxHighlighting, defaultHighlightStyle, HighlightStyle } from '@codemirror/language'
import { tags } from '@lezer/highlight'

// Evolution dark theme — matches --bg-primary, --evo-green palette
const evoTheme = EditorView.theme({
  '&': {
    backgroundColor: '#091410',
    color: '#C8D5CE',
    height: '100%',
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
    fontSize: '13px',
  },
  '.cm-content': {
    caretcolor: '#85F2A0',
    padding: '12px 0',
  },
  '.cm-cursor': {
    borderLeftcolor: '#85F2A0',
    borderLeftWidth: '2px',
  },
  '.cm-selectionBackground, ::selection': {
    backgroundColor: '#1a2744',
  },
  '&.cm-focused .cm-selectionBackground': {
    backgroundColor: '#1a2744',
  },
  '.cm-gutters': {
    backgroundColor: '#07130D',
    color: '#6B8A76',
    border: 'none',
    borderRight: '1px solid #1E3829',
  },
  '.cm-gutter': {
    minWidth: '48px',
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#122018',
    color: '#C8D5CE',
  },
  '.cm-activeLine': {
    backgroundColor: 'rgba(133, 242, 160, 0.04)',
  },
  '.cm-lineNumbers .cm-gutterElement': {
    padding: '0 12px 0 8px',
  },
  '.cm-scroller': {
    overflow: 'auto',
  },
}, { dark: true })

// Syntax highlighting for Evolution theme
const evoHighlight = HighlightStyle.define([
  { tag: tags.keyword, color: '#85F2A0' },
  { tag: tags.operator, color: '#85F2A0' },
  { tag: tags.string, color: '#7ee787' },
  { tag: tags.number, color: '#79c0ff' },
  { tag: tags.bool, color: '#79c0ff' },
  { tag: tags.null, color: '#79c0ff' },
  { tag: tags.comment, color: '#6B8A76', fontStyle: 'italic' },
  { tag: tags.function(tags.variableName), color: '#d2a8ff' },
  { tag: tags.variableName, color: '#C8D5CE' },
  { tag: tags.typeName, color: '#ffa657' },
  { tag: tags.className, color: '#ffa657' },
  { tag: tags.propertyName, color: '#79c0ff' },
  { tag: tags.heading, color: '#85F2A0', fontWeight: 'bold' },
  { tag: tags.emphasis, fontStyle: 'italic' },
  { tag: tags.strong, fontWeight: 'bold' },
  { tag: tags.link, color: '#85F2A0', textDecoration: 'underline' },
  { tag: tags.url, color: '#7ee787' },
  { tag: tags.meta, color: '#6B8A76' },
  { tag: tags.tagName, color: '#7ee787' },
  { tag: tags.attributeName, color: '#79c0ff' },
  { tag: tags.attributeValue, color: '#a5d6ff' },
  { tag: tags.punctuation, color: '#C8D5CE' },
  { tag: tags.bracket, color: '#C8D5CE' },
])

export function languageForPath(path: string): Extension[] {
  const ext = path.split('.').pop()?.toLowerCase() ?? ''
  switch (ext) {
    case 'md':
    case 'markdown':
      return [markdown()]
    case 'json':
    case 'jsonc':
      return [json()]
    case 'py':
      return [python()]
    case 'js':
    case 'mjs':
    case 'cjs':
      return [javascript()]
    case 'ts':
    case 'tsx':
    case 'jsx':
      return [javascript({ typescript: true, jsx: true })]
    default:
      return []
  }
}

export function baseExtensions(readOnly: boolean, onSave?: () => void): Extension[] {
  const saveKeymap = onSave
    ? keymap.of([{
        key: 'Mod-s',
        run: () => { onSave(); return true },
      }])
    : []

  return [
    lineNumbers(),
    history(),
    drawSelection(),
    highlightActiveLine(),
    syntaxHighlighting(evoHighlight),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    keymap.of([...defaultKeymap, ...historyKeymap]),
    evoTheme,
    EditorState.readOnly.of(readOnly),
    EditorView.lineWrapping,
    saveKeymap,
  ]
}

export { EditorView, EditorState, StateEffect }
