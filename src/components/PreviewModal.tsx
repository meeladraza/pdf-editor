// import { X, Download } from 'lucide-react';
import { useState } from 'react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Statement Preview</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            {/* <X className="w-6 h-6 text-gray-600" /> */}
            CLOSE
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          <div className="bg-white rounded-lg shadow-sm">
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </div>
        </div>

        <div className="p-6 border-t bg-white flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Close
          </button>
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium shadow-md"
          >
            {/* <Download className="w-5 h-5" /> */}
            {isGenerating ? 'Generating PDF...' : 'Download PDF'}
          </button>
        </div>
      </div>
    </div>
  );
};
