// ============================================================
// Embed images as base64 (keep your existing function as-is)
// ============================================================
const embedImages = async (html: string): Promise<string> => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const imgs = Array.from(doc.getElementsByTagName("img"));

    await Promise.all(
      imgs.map(async (img) => {
        const src = img.getAttribute("src");
        if (!src || src.startsWith("data:")) return;

        let imageUrl = src;
        if (src.startsWith("/")) {
          imageUrl = window.location.origin + src;
        } else if (!/^https?:\/\//i.test(src)) {
          imageUrl = new URL(src, window.location.href).toString();
        }

        try {
          const resp = await fetch(imageUrl);
          if (!resp.ok) return;
          const blob = await resp.blob();
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = (e) => reject(e);
            reader.readAsDataURL(blob);
          });
          img.setAttribute("src", dataUrl);
        } catch (e) {
          console.warn("Failed to inline image", src, e);
        }
      }),
    );

    return doc.documentElement.outerHTML;
  } catch (e) {
    console.warn("embedImages error", e);
    return html;
  }
};

// ============================================================
// MAIN: Generate PDF using Gotenberg
// ============================================================
const API_BASE = import.meta.env.VITE_API_BASE_URL as string;

export const generatePDF = async (
  htmlContent: string,
): Promise<ArrayBuffer> => {
  try {
    const htmlWithImages = await embedImages(htmlContent);

    const response = await fetch(`${API_BASE}/api/generate-pdf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ html: htmlWithImages }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`PDF generation failed: ${errorText}`);
    }

    return await response.arrayBuffer();
  } catch (error) {
    console.error("PDF generation failed:", error);
    throw error;
  }
};

// ============================================================
// Download helper (unchanged from your original)
// ============================================================
export const downloadPDF = (
  pdfData: ArrayBuffer,
  filename: string = "bank-statement.pdf",
) => {
  const blob = new Blob([pdfData], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
