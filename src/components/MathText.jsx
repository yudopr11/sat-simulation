import React from 'react'
import katex from 'katex'

/**
 * MathText renders a string that may contain:
 *   - Inline math:   $...$
 *   - Display math:  $$...$$
 *   - Plain HTML:    <br>, <strong>, etc. (passed via dangerouslySetInnerHTML)
 *   - Literal $:     write \$ in the text string
 *
 * All content in data files is author-controlled, so dangerouslySetInnerHTML is safe here.
 */

function parseMathText(rawText) {
  if (!rawText) return []

  // Escape \$ to a placeholder, then restore after parsing
  const text = rawText.replace(/\\\$/g, '\x00DOLLAR\x00')

  const segments = []
  // Match $$...$$ (display) first, then $...$ (inline)
  const pattern = /(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$)/g
  let lastIndex = 0
  let match

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        content: text.slice(lastIndex, match.index),
      })
    }
    const isBlock = match[0].startsWith('$$')
    const latex = isBlock ? match[0].slice(2, -2) : match[0].slice(1, -1)
    segments.push({ type: 'math', content: latex, display: isBlock })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'text', content: text.slice(lastIndex) })
  }

  return segments
}

function restoreDollars(str) {
  return str.replace(/\x00DOLLAR\x00/g, '$')
}

export default function MathText({ text, className = '' }) {
  if (!text) return null

  const segments = parseMathText(text)

  return (
    <span className={className}>
      {segments.map((seg, i) => {
        if (seg.type === 'text') {
          const html = restoreDollars(seg.content)
          return (
            <span
              key={i}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )
        }
        // Math segment — render with KaTeX
        let html
        try {
          html = katex.renderToString(seg.content, {
            throwOnError: false,
            displayMode: seg.display,
            output: 'html',
          })
        } catch {
          html = seg.content
        }
        return (
          <span
            key={i}
            className={seg.display ? 'block my-3 text-center' : 'inline'}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )
      })}
    </span>
  )
}
