export const generatePDF = async (htmlContent: string): Promise<ArrayBuffer> => {
  try {
    // Try different CORS proxies
    const proxyUrls = [
      'https://api.allorigins.win/raw?url=',
      'https://corsproxy.io/?',
      'https://proxy.cors.sh/',
      'https://cors.connetto.io/'
    ];

    const targetUrl = 'https://html2pdf-generator.vercel.app/api/pdf';
    
    let lastError;
    
    for (const proxyUrl of proxyUrls) {
      try {
        const response = await fetch(proxyUrl + encodeURIComponent(targetUrl), {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ html: htmlContent }),
        });

        if (response.ok) {
          const pdfArrayBuffer = await response.arrayBuffer();
          return pdfArrayBuffer;
        }
      } catch (error) {
        lastError = error;
        console.warn(`Proxy ${proxyUrl} failed, trying next...`);
      }
    }
    
    throw lastError || new Error('All CORS proxies failed');

  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};

export const downloadPDF = (pdfData: ArrayBuffer, filename: string = 'bank-statement.pdf') => {
  const blob = new Blob([pdfData], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
