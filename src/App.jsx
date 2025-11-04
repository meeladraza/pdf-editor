import React, { useEffect, useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const GEMINI_API_KEY = "AIzaSyBNfQXuzrrwJR1a3VP1DIq7aRHiP5wz_EU";

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
  });

export default function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [ifCol, setIfCol] = useState("");
  const [condition, setCondition] = useState("");
  const [targetCol, setTargetCol] = useState("");
  const [replaceText, setReplaceText] = useState("");

  useEffect(() => {
    console.log("columns:", columns);
    console.log("rows:", rows);
  }, [columns, rows]);

  function detectBankFromPdfText(text) {
    console.log("Detecting bank from text:", text);
    // Extract number after "Account No"
    const match = text.match(/Account\s*No\s*[:\-]?\s*([0-9\-]+)/i);
    console.log("Account No match:", match);
    if (!match) return "Unknown";

    const accountNumber = match[1].replace(/\D/g, ""); // remove hyphens/spaces

    // Detect based on format
    if (/^\d{8,12}$/.test(accountNumber)) return "UBL"; // UBL: 8–12 digits
    if (/^\d{16}$/.test(accountNumber)) return "Faysal"; // Faysal: 16 digits
    if (/^\d{13}$/.test(accountNumber)) return "HBL";
    if (/^\d{14}$/.test(accountNumber)) return "MCB/Meezan";

    return "Unknown";
  }

  // --- Extract table with Gemini ---
  const extractTable = async () => {
    if (!file) return alert("Please upload a PDF first.");
    setStatus("Extracting table using Gemini...");

    const prompt = `
Extract the **main transaction table** from this PDF (bank statement) and return it as a JSON array of objects.

Rules:
- Each object = one transaction (one row).
- Headers: use the exact visible column names such as "Date", "Posting Date", "Effective Date", "Narration", "Description", "Debit", "Withdrawal", "Credit", "Deposit", "Balance".
- DO NOT include rows that repeat the header names.
- DO NOT include rows like "Opening Balance", "Closing Balance", "Ending Balance", "Available Balance", or "No. of Transactions".
- Include only rows that represent actual financial transactions (rows with numeric debit/credit or balance values).
- Preserve all text and numeric formats (e.g., "1,234.56", "Cr", "Dr").
- Return ONLY valid JSON.
`;

    try {
      const base64Data = await toBase64(file);
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: prompt },
                  {
                    inlineData: { mimeType: file.type, data: base64Data },
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";

      let cleaned = text.trim();
      if (cleaned.startsWith("```")) {
        cleaned = cleaned
          .replace(/^```(?:json)?/, "")
          .replace(/```$/, "")
          .trim();
      }

      let json;
      try {
        json = JSON.parse(cleaned);
      } catch (err) {
        console.error("Gemini returned invalid JSON:", cleaned);
        setStatus("❌ Gemini failed to return valid JSON.");
        return;
      }

      if (Array.isArray(json) && json.length > 0) {
        const cols = Object.keys(json[0]);
        setColumns([]);
        setRows([]);
        setColumns(cols);
        setRows(json);
        setStatus(`✅ Extracted ${json.length} rows, ${cols.length} columns.`);
      } else {
        setStatus("❌ No table detected.");
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Gemini API error.");
    }
  };

  // --- Apply rule in table preview ---
  const applyRule = () => {
    if (!ifCol || !condition || !targetCol || !replaceText) {
      alert("Please fill all fields first.");
      return;
    }

    // 🔍 Try to auto-detect Debit and Credit columns
    const debitCol =
      columns.find((c) =>
        /debit|withdrawal|dr/i.test(c.replace(/\*/g, "").trim())
      ) || "";
    const creditCol =
      columns.find((c) =>
        /credit|deposit|cr/i.test(c.replace(/\*/g, "").trim())
      ) || "";

    console.log("Detected Debit column:", debitCol);
    console.log("Detected Credit column:", creditCol);

    const updated = rows.map((r) => {
      const val = (r[ifCol] || "").trim();

      const debit = debitCol ? (r[debitCol] || "").trim() : "";
      const credit = creditCol ? (r[creditCol] || "").trim() : "";

      // 🛑 Skip "Opening Balance" or "Closing Balance"-type rows
      // (both debit and credit empty, but balance/value exists)
      if (!debit && !credit) {
        return r;
      }

      const numVal = parseFloat(val.replace(/,/g, "")) || 0;

      const shouldReplace =
        (condition === "null" && !val) ||
        (condition === "notnull" && !!val) ||
        (condition === "gt0" && numVal > 0) ||
        (condition === "lt0" && numVal < 0) ||
        (condition === "eq0" && numVal === 0);

      if (shouldReplace) {
        const originalKey = `original_${targetCol}`;
        return {
          ...r,
          [originalKey]: r[targetCol],
          [targetCol]: replaceText,
        };
      }

      return r;
    });

    console.log("Updated preview rows:", updated);
    setRows(updated);
    setStatus("✅ Preview updated. (Now click 'Update PDF & Download')");
  };

  // --- Replace inside PDF and download ---
  const applyToPdf = async () => {
    if (!file || rows.length === 0) {
      alert("Please extract and modify table first.");
      return;
    }

    try {
      setStatus("Replacing only target column text in-place...");

      const buffer = await file.arrayBuffer();
      const jsBuffer = buffer.slice(0);
      const libBuffer = buffer.slice(0);

      const jsPdf = await pdfjsLib.getDocument({ data: jsBuffer }).promise;
      const libPdf = await PDFDocument.load(libBuffer);
      const font = await libPdf.embedFont(StandardFonts.Helvetica);

      // Build a lookup of old->new values for "Particulars"
      const replacements = rows
        .filter((r) => r[targetCol])
        .map((r) => ({
          oldValue: (r[`original_${targetCol}`] || "").trim(),
          newValue: (r[targetCol] || "").trim(),
        }))
        .filter((r) => r.oldValue && r.newValue && r.oldValue !== r.newValue);

      if (replacements.length === 0) {
        setStatus("❌ No text changes detected.");
        return;
      }

      console.log("🧾 Will replace these:", replacements);

      for (let i = 0; i < jsPdf.numPages; i++) {
        const jsPage = await jsPdf.getPage(i + 1);
        const libPage = libPdf.getPage(i);
        const textContent = await jsPage.getTextContent();
        const pageText = textContent.items.map((i) => i.str).join(" ");
        const detectedBank = detectBankFromPdfText(pageText);
        console.log(`Detected bank:`, detectedBank);

        for (const item of textContent.items) {
          const str = item.str?.trim();
          if (!str) continue;

          // find matching old text
          const match = replacements.find(
            (r) =>
              r.oldValue &&
              str
                .replace(/\s+/g, " ")
                .toLowerCase()
                .includes(r.oldValue.toLowerCase().slice(0, 10))
          );

          if (!match) continue;

          const [a, b, c, d, e, f] = item.transform;
          const fontSize = Math.sqrt(a * a + b * b);
          const x = e;
          const y = f;
          const width = font.widthOfTextAtSize(str, fontSize);

          // clear old text
          libPage.drawRectangle({
            x: x - 1,
            y: y - fontSize * (detectedBank === "Faysal" ? 0.2 : 1.3),
            width: detectedBank === "Faysal" ? width + 50 : width - 5.5,
            height: fontSize * (detectedBank === "Faysal" ? 1.5 : 2),
            color: rgb(1, 1, 1),
          });

          // draw new text
          libPage.drawText(match.newValue, {
            x,
            y,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
          });

          console.log(`✅ "${str}" → "${match.newValue}" on page ${i + 1}`);
        }
      }

      const updatedBytes = await libPdf.save();
      saveAs(
        new Blob([updatedBytes], { type: "application/pdf" }),
        "updated_particulars.pdf"
      );
      setStatus("✅ Updated PDF downloaded successfully.");
    } catch (err) {
      console.error("DF update failed:", err);
      setStatus("❌ PDF update failed: " + err.message);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h2>PDF Table Extract + Conditional Replace + Save</h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={extractTable} style={{ marginLeft: 8 }}>
        Extract Table
      </button>
      <p>{status}</p>

      {columns.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>Conditional Rule</h3>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <select value={ifCol} onChange={(e) => setIfCol(e.target.value)}>
              <option value="">IF column...</option>
              {columns.map((col) => (
                <option key={col}>{col}</option>
              ))}
            </select>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            >
              <option value="">Condition...</option>
              <option value="null">is empty</option>
              <option value="notnull">is not empty</option>
              <option value="eq0">equal to 0</option>
              <option value="gt0">greater than 0</option>
              <option value="lt0">less than 0</option>
            </select>
            <select
              value={targetCol}
              onChange={(e) => setTargetCol(e.target.value)}
            >
              <option value="">Target column...</option>
              {columns.map((col) => (
                <option key={col}>{col}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Replace text..."
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
            />
            <button onClick={applyRule}>Apply Rule</button>
          </div>

          <button onClick={applyToPdf} style={{ marginBottom: 10 }}>
            📝 Update PDF & Download
          </button>

          <div style={{ maxHeight: 300, overflowY: "auto" }}>
            <table
              border="1"
              cellPadding="5"
              style={{ borderCollapse: "collapse", width: "100%" }}
            >
              <thead>
                <tr>
                  {columns.map((c) => (
                    <th key={c}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 20).map((r, i) => (
                  <tr key={i}>
                    {columns.map((c) => (
                      <td key={c}>{r[c]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
