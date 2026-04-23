export const DEFAULT_PAGE_SIZE = 10

export function paginateRows(rows, page, pageSize = DEFAULT_PAGE_SIZE) {
  const safeSize = Math.max(1, Number(pageSize) || DEFAULT_PAGE_SIZE)
  const total = rows.length
  const totalPages = Math.max(1, Math.ceil(total / safeSize))
  const safePage = Math.min(Math.max(1, Number(page) || 1), totalPages)
  const start = (safePage - 1) * safeSize
  const end = start + safeSize
  return {
    page: safePage,
    pageSize: safeSize,
    total,
    totalPages,
    start,
    end,
    items: rows.slice(start, end),
  }
}

function csvEscape(value) {
  const s = value == null ? '' : String(value)
  return `"${s.replaceAll('"', '""')}"`
}

export function toCsv(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return ''
  const headers = Object.keys(rows[0])
  const lines = [headers.map(csvEscape).join(',')]
  for (const row of rows) {
    lines.push(headers.map((h) => csvEscape(row[h])).join(','))
  }
  return lines.join('\n')
}

export function downloadCsv(filename, rows) {
  const csv = toCsv(rows)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function confirmDangerAction(entityLabel = 'cet élément') {
  const promptText = `Pour confirmer la suppression de ${entityLabel}, tapez SUPPRIMER`
  const answer = window.prompt(promptText, '')
  return String(answer || '').trim().toUpperCase() === 'SUPPRIMER'
}
