import { useState } from 'react';
import { X, Download, FileText, Loader2, Printer } from 'lucide-react';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  htmlContent: string;
  onDownloadPDF: () => Promise<void>;
}

export const PreviewModal = ({ isOpen, onClose, htmlContent, onDownloadPDF }: PreviewModalProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      await onDownloadPDF();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-slate-100">

      {/* ── Preview area ─────────────────────────────────────── */}
      <div className="flex-1 overflow-auto p-5">
        <div
          className="bg-white rounded-xl shadow-xl mx-auto"
          style={{ maxWidth: 1200 }}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>

      {/* ── Right action panel ───────────────────────────────── */}
      <aside className="w-64 min-w-[256px] bg-white border-l border-slate-200 flex flex-col shadow-xl">

        {/* Panel header */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 px-5 py-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/15 hover:bg-white/25 rounded-lg flex items-center justify-center transition-colors"
              title="Close"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
          <h2 className="text-white font-bold text-sm">Statement Ready</h2>
          <p className="text-blue-200 text-xs mt-0.5">Review and download your PDF</p>
        </div>

        {/* Actions */}
        <div className="flex-1 p-4 flex flex-col gap-3">

          {/* Info card */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                <Printer className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-slate-700">Print-ready PDF</div>
                <div className="text-[10px] text-slate-400">A4 · Professional format</div>
              </div>
            </div>
          </div>

          {/* Download button */}
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</>
            ) : (
              <><Download className="w-4 h-4" /> Download PDF</>
            )}
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full py-2.5 border border-slate-200 text-slate-600 rounded-xl font-medium text-sm hover:bg-slate-50 transition-colors"
          >
            Close Preview
          </button>

        </div>

        {/* Panel footer hint */}
        <div className="px-4 pb-4 pt-2 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 text-center leading-relaxed">
            Scroll the left panel to review all pages before downloading.
          </p>
        </div>

      </aside>
    </div>
  );
};
