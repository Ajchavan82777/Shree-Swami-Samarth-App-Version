/**
 * tableExport.js
 * Utility functions for exporting table data to CSV, Excel, Word, and Print.
 */

/**
 * Download table data as a CSV file.
 * @param {object[]} rows - Array of data row objects.
 * @param {Array<{key: string, label: string, exportFn?: function}>} columns
 * @param {string} filename - Output filename (without extension).
 */
export function downloadCSV(rows, columns, filename) {
  const headers = columns.map(c => `"${c.label}"`).join(',');
  const lines = rows.map(row =>
    columns.map(c => {
      const raw = c.exportFn ? c.exportFn(row[c.key], row) : (row[c.key] ?? '');
      return `"${String(raw).replace(/"/g, '""')}"`;
    }).join(',')
  );
  const csv = '﻿' + [headers, ...lines].join('\r\n');
  triggerDownload(new Blob([csv], { type: 'text/csv;charset=utf-8' }), filename + '.csv');
}

/**
 * Download table data as an Excel-compatible .xls file (HTML table format).
 * @param {object[]} rows
 * @param {Array<{key: string, label: string, exportFn?: function}>} columns
 * @param {string} filename - Output filename (without extension).
 */
export function downloadExcel(rows, columns, filename) {
  const th = columns
    .map(c => `<th style="background:#1e293b;color:#fff;padding:8px;font-weight:bold">${c.label}</th>`)
    .join('');
  const tbody = rows.map(row => {
    const tds = columns.map(c => {
      const val = c.exportFn ? c.exportFn(row[c.key], row) : (row[c.key] ?? '');
      return `<td style="padding:8px;border:1px solid #ddd">${String(val)}</td>`;
    }).join('');
    return `<tr>${tds}</tr>`;
  }).join('');

  const html = [
    '<html xmlns:o="urn:schemas-microsoft-com:office:office"',
    '      xmlns:x="urn:schemas-microsoft-com:office:excel"',
    '      xmlns="http://www.w3.org/TR/REC-html40">',
    '<head><meta charset="utf-8">',
    '<!--[if gte mso 9]><xml>',
    '  <x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>',
    '    <x:Name>Sheet1</x:Name>',
    '    <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>',
    '  </x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook>',
    '</xml><![endif]-->',
    '</head>',
    '<body>',
    `<table><thead><tr>${th}</tr></thead><tbody>${tbody}</tbody></table>`,
    '</body></html>',
  ].join('');

  triggerDownload(
    new Blob(['﻿', html], { type: 'application/vnd.ms-excel' }),
    filename + '.xls'
  );
}

/**
 * Download table data as a Word-compatible .doc file (HTML table format).
 * @param {object[]} rows
 * @param {Array<{key: string, label: string, exportFn?: function}>} columns
 * @param {string} filename - Output filename (without extension). Also used as document heading.
 */
export function downloadWordTable(rows, columns, filename) {
  const th = columns.map(c => `<th>${c.label}</th>`).join('');
  const tbody = rows.map(row => {
    const tds = columns.map(c => {
      const val = c.exportFn ? c.exportFn(row[c.key], row) : (row[c.key] ?? '');
      return `<td>${String(val)}</td>`;
    }).join('');
    return `<tr>${tds}</tr>`;
  }).join('');

  const html = [
    "<html xmlns:o='urn:schemas-microsoft-com:office:office'",
    "      xmlns:w='urn:schemas-microsoft-com:office:word'>",
    "<head><meta charset='utf-8'>",
    "<style>",
    "  @page { size: A4 landscape; margin: 1cm }",
    "  body  { font-family: Arial; font-size: 10pt }",
    "  table { border-collapse: collapse; width: 100% }",
    "  th    { background: #1e293b !important; color: #fff !important;",
    "          padding: 8pt; font-size: 10pt; -webkit-print-color-adjust: exact }",
    "  td    { padding: 6pt; border: 1px solid #ccc; font-size: 10pt }",
    "</style>",
    "</head>",
    "<body>",
    `<h2 style="font-size:14pt;margin-bottom:10pt">${filename}</h2>`,
    `<table><thead><tr>${th}</tr></thead><tbody>${tbody}</tbody></table>`,
    "</body></html>",
  ].join('');

  triggerDownload(
    new Blob(['﻿', html], { type: 'application/msword' }),
    filename + '.doc'
  );
}

/**
 * Open the browser print dialog scoped to a specific DOM table element.
 * Injects a temporary print-only stylesheet so only the table is printed.
 * @param {HTMLElement} tableElement - The DOM element to print.
 * @param {string} filename - Used as the document title for print header/footer.
 */
export function downloadPrintTable(tableElement, filename) {
  if (!tableElement) return;

  const styleId = '__print_table_style__';
  let style = document.getElementById(styleId);
  if (!style) {
    style = document.createElement('style');
    style.id = styleId;
    document.head.appendChild(style);
  }

  // Mark the element to print
  const marker = '__print_target__';
  tableElement.classList.add(marker);

  style.textContent = `
    @media print {
      body > *:not(.${marker}), body > *:not(.${marker}) * { display: none !important; }
      .${marker}, .${marker} * { display: revert !important; }
      .${marker} { page-break-inside: auto; }
      @page { size: A4 landscape; margin: 1cm; }
    }
  `;

  const prevTitle = document.title;
  document.title = filename;

  window.print();

  // Cleanup after print dialog closes
  requestAnimationFrame(() => {
    document.title = prevTitle;
    tableElement.classList.remove(marker);
    style.textContent = '';
  });
}

// ─── Internal helper ──────────────────────────────────────────────────────────

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
