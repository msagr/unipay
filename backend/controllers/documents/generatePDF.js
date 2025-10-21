import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";
import transporter from "../../helpers/emailTransport.js";
import emailTemplate from "../../utils/pdf/emailTemplate.js";
import pdfTemplate from "../../utils/pdf/pdfTemplate.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filepath = path.join(__dirname, "../../../docs/myDocument.pdf");

// $-title   Generate document
// $-path    POST /api/v1/document/generate-pdf
// $-auth    Public
export const generatePDF = async (req, res) => {
  try {
    const html = pdfTemplate(req.body);
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    await page.pdf({
      path: filepath,
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
      file: "myDocument.pdf",
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
  res.sendFile(filepath);
};

// $-title   Send document via email
// $-path    POST /api/v1/document/send-document
// $-auth    Public
export const sendDocument = async (req, res) => {
  const { profile, document } = req.body;

  try {
    const html = pdfTemplate(req.body);
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    await page.pdf({
      path: filepath,
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    // Send email with attachment
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
          filename: "myDocument.pdf",
          path: filepath,
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Document sent successfully",
    });
  } catch (error) {
    console.error("Error sending document:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
