import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import transporter from "../../helpers/emailTransport.js";
import emailTemplate from "../../utils/pdf/emailTemplate.js";
import pdfTemplate from "../../utils/pdf/pdfTemplate.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure docs folder exists
const docsDir = path.join(__dirname, "../../../docs");
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

// $-title   Generate document
// $-path    POST /api/v1/document/generate-pdf
// $-auth    Public
export const generatePDF = async (req, res) => {
  try {
    if (!req.body || !req.body.document) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid document data" });
    }

    const html = pdfTemplate(req.body);
    const uniqueFileName = `document_${Date.now()}.pdf`;
    const filePath = path.join(docsDir, uniqueFileName);

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    await page.pdf({
      path: filePath,
      format: "A4",
      printBackground: true,
      margin: {
        top: "10mm",
        bottom: "10mm",
        left: "10mm",
        right: "10mm",
      },
    });

    await browser.close();

    return res.status(200).json({
      success: true,
      message: "PDF generated successfully",
      file: uniqueFileName,
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// $-title   Get generated PDF
// $-path    GET /api/v1/document/get-pdf
// $-auth    Public
export const getPDF = (req, res) => {
  const fileName = req.query.name || "myDocument.pdf";
  const filePath = path.join(docsDir, fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: "File not found" });
  }

  res.sendFile(filePath);
};

// $-title   Send document via email
// $-path    POST /api/v1/document/send-document
// $-auth    Public
export const sendDocument = async (req, res) => {
  const { profile, document } = req.body;

  try {
    if (!profile || !document) {
      return res
        .status(400)
        .json({ success: false, message: "Missing profile or document data" });
    }

    const html = pdfTemplate(req.body);
    const uniqueFileName = `document_${Date.now()}.pdf`;
    const filePath = path.join(docsDir, uniqueFileName);

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    await page.pdf({
      path: filePath,
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    // Send email with PDF attachment
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: document.customer.email,
      replyTo: profile.email,
      subject: `Document from ${
        profile.businessName ? profile.businessName : profile.firstName
      }`,
      text: `Document from ${
        profile.businessName ? profile.businessName : profile.firstName
      }`,
      html: emailTemplate(req.body),
      attachments: [
        {
          filename: "document.pdf",
          path: filePath,
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Document emailed successfully",
    });
  } catch (error) {
    console.error("Error sending document:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
