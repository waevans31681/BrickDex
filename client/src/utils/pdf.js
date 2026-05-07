import jsPDF from 'jspdf'

// Generates and triggers download of a wish list PDF.
// items: array of wish list item records from the wishlistStore
export async function exportWishlistPdf(items) {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' })

  const PAGE_W = doc.internal.pageSize.getWidth()
  const MARGIN = 40
  const COL_W = (PAGE_W - MARGIN * 2 - 12) / 2

  // Header
  doc.setFontSize(22)
  doc.setTextColor('#E3000B')
  doc.text('BrickDex Wish List', MARGIN, 50)
  doc.setFontSize(10)
  doc.setTextColor('#666666')
  doc.text(`Generated ${new Date().toLocaleDateString()}`, MARGIN, 68)
  doc.setDrawColor('#E3000B')
  doc.setLineWidth(1.5)
  doc.line(MARGIN, 76, PAGE_W - MARGIN, 76)

  // Items — two-column grid
  let x = MARGIN
  let y = 96
  const ROW_H = 90

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const col = i % 2

    if (col === 0 && i !== 0) {
      y += ROW_H + 12
      if (y + ROW_H > doc.internal.pageSize.getHeight() - MARGIN) {
        doc.addPage()
        y = MARGIN + 20
      }
    }

    x = col === 0 ? MARGIN : MARGIN + COL_W + 12

    // Set image placeholder box
    doc.setDrawColor('#cccccc')
    doc.setFillColor('#f5f5f5')
    doc.roundedRect(x, y, 64, 64, 4, 4, 'FD')

    // TODO: embed set image from imageUrl (requires converting URL to base64)

    // Set details
    const textX = x + 70
    doc.setFontSize(10)
    doc.setTextColor('#111111')
    doc.setFont(undefined, 'bold')
    doc.text(item.name || 'Unknown Set', textX, y + 14, { maxWidth: COL_W - 76 })
    doc.setFont(undefined, 'normal')
    doc.setFontSize(9)
    doc.setTextColor('#555555')
    doc.text(`#${item.setNumber}  ·  ${item.theme || ''}`, textX, y + 28)
    if (item.pieceCount) doc.text(`${item.pieceCount} pieces`, textX, y + 40)
    if (item.retailPrice) doc.text(`Retail: $${item.retailPrice.toFixed(2)}`, textX, y + 52)
    if (item.priority) {
      doc.setTextColor(priorityColor(item.priority))
      doc.text(item.priority, textX, y + 64)
    }
    if (item.notes) {
      doc.setTextColor('#777777')
      doc.setFontSize(8)
      doc.text(item.notes, x, y + ROW_H - 4, { maxWidth: COL_W })
    }
  }

  doc.save('brickdex-wishlist.pdf')
}

function priorityColor(priority) {
  switch (priority) {
    case 'HIGH':   return '#E3000B'
    case 'MEDIUM': return '#F59E0B'
    case 'LOW':    return '#6B7280'
    default:       return '#6B7280'
  }
}
