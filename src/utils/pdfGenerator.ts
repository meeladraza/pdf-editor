// const proxyUrls = [
//   'https://api.allorigins.win/raw?url=',
//   'https://corsproxy.io/?',
//   'https://proxy.cors.sh/',
//   'https://cors.connetto.io/'
// ];

// const targetUrl = 'https://html2pdf-generator.vercel.app/api/pdf';

// const embedImages = async (html: string): Promise<string> => {
//   try {
//     const parser = new DOMParser();
//     const doc = parser.parseFromString(html, 'text/html');
//     const imgs = Array.from(doc.getElementsByTagName('img'));

//     await Promise.all(
//       imgs.map(async (img) => {
//         const src = img.getAttribute('src');
//         if (!src) return;
//         if (src.startsWith('data:')) return; // already inlined

//         let imageUrl = src;
//         if (src.startsWith('/')) {
//           imageUrl = window.location.origin + src;
//         } else if (!/^https?:\/\//i.test(src)) {
//           imageUrl = new URL(src, window.location.href).toString();
//         }

//         try {
//           const resp = await fetch(imageUrl);
//           if (!resp.ok) return;
//           const blob = await resp.blob();
//           const dataUrl = await new Promise<string>((resolve, reject) => {
//             const reader = new FileReader();
//             reader.onload = () => resolve(String(reader.result));
//             reader.onerror = (e) => reject(e);
//             reader.readAsDataURL(blob);
//           });
//           img.setAttribute('src', dataUrl);
//         } catch (e) {
//           // don't fail whole flow for one missing image
//           // keep original src so the PDF service can try to fetch it
//           console.warn('Failed to inline image', src, e);
//         }
//       })
//     );

//     return doc.documentElement.outerHTML;
//   } catch (e) {
//     console.warn('embedImages error', e);
//     return html;
//   }
// };

// export const generatePDF = async (htmlContent: string): Promise<ArrayBuffer> => {
//   try {
//     const htmlWithImages = await embedImages(htmlContent);

//     let lastError: Error | null = null;

//     for (const proxyUrl of proxyUrls) {
//       try {
//         const response = await fetch(proxyUrl + encodeURIComponent(targetUrl), {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ html: htmlWithImages }),
//         });

//         if (response.ok) {
//           const pdfArrayBuffer = await response.arrayBuffer();
//           return pdfArrayBuffer;
//         }
//       } catch (error) {
//         lastError = error as Error;
//         console.warn(`Proxy ${proxyUrl} failed, trying next...`);
//       }
//     }

//     throw lastError || new Error('All CORS proxies failed');
//   } catch (error) {
//     console.error('Error generating PDF:', error);
//     throw error;
//   }
// };

// export const downloadPDF = (pdfData: ArrayBuffer, filename: string = 'bank-statement.pdf') => {
//   const blob = new Blob([pdfData], { type: 'application/pdf' });
//   const url = window.URL.createObjectURL(blob);
//   const link = document.createElement('a');
//   link.href = url;
//   link.download = filename;
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
//   window.URL.revokeObjectURL(url);
// };



// ============================================================
// CONFIG - change this to your Gotenberg server URL
// ============================================================
const GOTENBERG_URL = 'http://59.103.117.15:4000'; // or your Render/Railway URL
// e.g. 'https://your-gotenberg-app.onrender.com'

// ============================================================
// Embed images as base64 (keep your existing function as-is)
// ============================================================
const embedImages = async (html: string): Promise<string> => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const imgs = Array.from(doc.getElementsByTagName('img'));

    await Promise.all(
      imgs.map(async (img) => {
        const src = img.getAttribute('src');
        if (!src || src.startsWith('data:')) return;

        let imageUrl = src;
        if (src.startsWith('/')) {
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
          img.setAttribute('src', dataUrl);
        } catch (e) {
          console.warn('Failed to inline image', src, e);
        }
      })
    );

    return doc.documentElement.outerHTML;
  } catch (e) {
    console.warn('embedImages error', e);
    return html;
  }
};

// ============================================================
// MAIN: Generate PDF using Gotenberg
// ============================================================
const PROXY_URL = '/api'; // your Node proxy

export const generatePDF = async (htmlContent: string): Promise<ArrayBuffer> => {
  try {
    const htmlWithImages = await embedImages(htmlContent);

    // ✅ Now send JSON to YOUR proxy (no CORS issue)
    const response = await fetch(`${PROXY_URL}/generate-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ html: htmlWithImages }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`PDF generation failed: ${errorText}`);
    }

    return await response.arrayBuffer();

  } catch (error) {
    console.error('PDF generation failed:', error);
    throw error;
  }
};

// ============================================================
// Download helper (unchanged from your original)
// ============================================================
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