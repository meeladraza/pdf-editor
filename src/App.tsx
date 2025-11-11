import { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { AccountInfoForm } from './components/AccountInfoForm';
import { Preview } from './components/Preview';
import { TransactionRow, AccountInfo } from './types';
import { generateHTML } from './utils/htmlGenerator';
import { generatePDF, downloadPDF } from './utils/pdfGenerator';

function App() {
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [accountInfo, setAccountInfo] = useState<AccountInfo>({
    branchCode: '0004-AMEEN SALEH MUHAMMAD ST. KHI',
    accountTitle: 'AR INDUSTRIES',
    address1: 'PLOT NO L-18 BLOCK NO 22',
    address2: 'F. B AREA KARACHI KARACHI',
    address3: 'KARACHI',
    regCellNo: '03219216849',
    ibanNo: 'PK55 UNIL 0109 0003 0116 5884',
    cifNo: '22249075',
    statementPeriod: 'From 01-OCT-2025 To 13-OCT-2025',
    accountNo: '000498400782',
    accountType: 'SAVING',
    productType: 'AMEEN BUSINESS ACCOUNT (ABA)',
    currency: 'PAKISTANI RUPEE',
    balance: '3,207,779.56 Cr',
    asOf: '13-OCT-2025',
  });
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDataLoaded = (data: TransactionRow[]) => {
    setTransactions(data);
    const html = generateHTML(data, accountInfo);
    setHtmlContent(html);
  };

  const handleAccountInfoChange = (info: AccountInfo) => {
    setAccountInfo(info);
    if (transactions.length > 0) {
      const html = generateHTML(transactions, info);
      setHtmlContent(html);
    }
  };

  const handleDownloadPDF = async () => {
    if (!htmlContent) {
      alert('Please upload an Excel file first');
      return;
    }

    setIsGenerating(true);
    try {
      const pdfData = await generatePDF(htmlContent);
      downloadPDF(pdfData, 'bank-statement.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <FileText className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">Bank Statement Generator</h1>
          </div>
          <p className="text-gray-600">Upload your Excel file to generate a professional PDF bank statement</p>
        </div>

        <div className="flex flex-col items-center gap-8">
          <FileUpload onDataLoaded={handleDataLoaded} />

          {transactions.length > 0 && (
            <>
              <AccountInfoForm accountInfo={accountInfo} onChange={handleAccountInfoChange} />

              <button
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium shadow-md"
              >
                <Download className="w-5 h-5" />
                {isGenerating ? 'Generating PDF...' : 'Download PDF'}
              </button>

              <Preview htmlContent={htmlContent} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
