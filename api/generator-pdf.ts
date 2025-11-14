// api/generate-pdf.ts

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  try {
    const { html } = await req.json();

    if (!html) {
      return new Response(JSON.stringify({ error: "HTML missing" }), {
        status: 400,
      });
    }

    // Your puppeteer service hosted on Vercel
    const targetUrl = "https://html2pdf-generator.vercel.app/api/pdf";

    // Server-to-server call (no CORS issues)
    const pdfResponse = await fetch(targetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html }),
    });

    if (!pdfResponse.ok) {
      return new Response(JSON.stringify({ error: "Puppeteer service error" }), {
        status: 500,
      });
    }

    const pdfArrayBuffer = await pdfResponse.arrayBuffer();

    return new Response(pdfArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=bank-statement.pdf",
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
