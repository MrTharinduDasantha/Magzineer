// PDFKit helper — generates branded revenue / analytics PDF reports for the admin "Analytics" page. Light editorial theme to match the site.
import PDFDocument from "pdfkit";

/**
 * Stream a branded revenue PDF directly to the Express response.
 *
 * @param {object} res         - Express response
 * @param {object} reportData  - { title, period, totalRevenue, subscriptionRevenue,
 *                                 purchaseRevenue, totalOrders, rows: [{date, type, user, amount, status}, ...] }
 */
export const generateRevenuePDF = (res, reportData) => {
  const {
    title = "Revenue Report",
    period = "",
    totalRevenue = 0,
    subscriptionRevenue = 0,
    purchaseRevenue = 0,
    totalOrders = 0,
    rows = [],
  } = reportData;

  // Set response headers to trigger a file download in the browser
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="magzineer-revenue-${Date.now()}.pdf"`,
  );

  // Initialize PDFKit document and pipe it to the response
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  doc.pipe(res);

  // Brand palette
  const CHARCOAL = "#1A1A1A";
  const CRIMSON = "#C73E3A";
  const GOLD = "#B89968";
  const MUTED = "#8C8378";

  // ---------- Header ----------
  doc
    .fillColor(CHARCOAL)
    .font("Helvetica-Bold")
    .fontSize(24)
    .text("Magzineer", { align: "left" });

  doc
    .fillColor(GOLD)
    .font("Helvetica")
    .fontSize(10)
    .text("EDITORIAL EXCELLENCE", { align: "left", characterSpacing: 2 });

  // Crimson accent rule under the masthead
  doc
    .moveTo(50, doc.y + 6)
    .lineTo(545, doc.y + 6)
    .strokeColor(CRIMSON)
    .lineWidth(2)
    .stroke();

  doc.moveDown(2);

  // ---------- Report title ----------
  doc.fillColor(CHARCOAL).font("Helvetica-Bold").fontSize(18).text(title);

  if (period) {
    doc
      .fillColor(MUTED)
      .font("Helvetica")
      .fontSize(11)
      .text(`Period: ${period}`);
  }

  doc.moveDown(1.5);

  // ---------- Summary block ----------
  doc.fillColor(CHARCOAL).font("Helvetica-Bold").fontSize(13).text("Summary");
  doc.moveDown(0.5);

  const summary = [
    ["Total Revenue", `$${Number(totalRevenue).toFixed(2)}`],
    ["Subscription Revenue", `$${Number(subscriptionRevenue).toFixed(2)}`],
    ["Single-Issue Revenue", `$${Number(purchaseRevenue).toFixed(2)}`],
    ["Total Orders", String(totalOrders)],
  ];

  summary.forEach(([label, value]) => {
    doc
      .font("Helvetica")
      .fontSize(11)
      .fillColor(MUTED)
      .text(label, 50, doc.y, { continued: true, width: 250 })
      .fillColor(CHARCOAL)
      .font("Helvetica-Bold")
      .text(value, { align: "right" });
    doc.moveDown(0.4);
  });

  doc.moveDown(1.5);

  // ---------- Transactions table ----------
  doc
    .fillColor(CHARCOAL)
    .font("Helvetica-Bold")
    .fontSize(13)
    .text("Transactions");
  doc.moveDown(0.5);

  // Table header
  const tableTop = doc.y;
  const colX = { date: 50, type: 130, user: 220, amount: 380, status: 470 };

  doc.font("Helvetica-Bold").fontSize(10).fillColor(CHARCOAL);
  doc.text("Date", colX.date, tableTop);
  doc.text("Type", colX.type, tableTop);
  doc.text("User", colX.user, tableTop);
  doc.text("Amount", colX.amount, tableTop);
  doc.text("Status", colX.status, tableTop);

  doc
    .moveTo(50, tableTop + 15)
    .lineTo(545, tableTop + 15)
    .strokeColor(GOLD)
    .lineWidth(0.5)
    .stroke();

  // Table body
  let y = tableTop + 22;
  doc.font("Helvetica").fontSize(10).fillColor(CHARCOAL);

  rows.forEach((row) => {
    // Add a new page if we're running out of room
    if (y > 760) {
      doc.addPage();
      y = 50;
    }

    doc.text(row.date || "-", colX.date, y);
    doc.text(row.type || "-", colX.type, y);
    doc.text(row.user || "-", colX.user, y, { width: 150, ellipsis: true });
    doc.text(`$${Number(row.amount || 0).toFixed(2)}`, colX.amount, y);
    doc.text(row.status || "-", colX.status, y);
    y += 18;
  });

  // ---------- Footer ----------
  doc
    .fontSize(9)
    .fillColor(MUTED)
    .text(`Generated on ${new Date().toLocaleString()}`, 50, 800, {
      align: "center",
      width: 495,
    });

  doc.end();
};
