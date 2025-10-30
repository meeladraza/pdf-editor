import express from "express";
import multer from "multer";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.text({ type: "text/html" }));

// ---- Convert PDF → HTML ----
app.post("/convert-pdf", upload.single("pdf"), (req, res) => {
  const inputPath = req.file.path;
  const fileName = path.parse(req.file.originalname).name;
  const outputDir = "converted";
  const outputPath = `${outputDir}/${fileName}.html`;

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const cmd = `pdf2htmlEX --zoom 1.3 "${inputPath}" "${outputPath}"`;

  exec(cmd, (error) => {
    if (error) {
      console.error(error);
      return res.status(500).send("❌ Conversion failed");
    }

    const html = fs.readFileSync(outputPath, "utf-8");
    res.send(html);
  });
});

// ---- Convert HTML → PDF ----
app.post("/html-to-pdf", async (req, res) => {
  const html = req.body;
  const puppeteer = await import("puppeteer");

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "networkidle0" });
  const pdf = await page.pdf({ format: "A4" });

  await browser.close();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=edited.pdf");
  res.send(pdf);
});

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));
