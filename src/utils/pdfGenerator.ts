// ============================================================
// MAIN: Generate PDF using Gotenberg
// Images are embedded server-side by the proxy — do NOT inline
// them here. Sending base64 images from the browser bloats the
// payload to 50MB+ for large statements and triggers 413 errors.
// ============================================================
const API_BASE = import.meta.env.VITE_API_BASE_URL as string;

export const generatePDF = async (
  htmlContent: string,
): Promise<ArrayBuffer> => {
  try {
    const response = await fetch(`${API_BASE}/api/generate-pdf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ html: htmlContent }),
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
// Download helper
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