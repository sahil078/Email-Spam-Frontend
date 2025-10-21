import { Download, Share, Mail, Check, X, AlertTriangle } from 'lucide-react';
import { SpamTest } from '../types';

interface TestReportProps {
  test: SpamTest;
}

export function TestReport({ test }: TestReportProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'spam':
        return <X className="w-5 h-5 text-red-500" />;
      case 'promotions':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <X className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'spam':
        return 'bg-red-100 text-red-800';
      case 'promotions':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const shareReport = () => {
    const url = `${window.location.origin}/report/${test.testCode}`;
    navigator.clipboard.writeText(url);
  };

  const exportPDF = () => {
    console.log('Export PDF');
  };

  // Ensure results is always an array
  const safeResults = Array.isArray(test?.results) ? test.results : [];
  const deliveredCount = safeResults.filter(r => r.status === 'delivered').length;
  const spamCount = safeResults.filter(r => r.status === 'spam').length;
  const promoCount = safeResults.filter(r => r.status === 'promotions').length;
  const notReceivedCount = safeResults.filter(r => r.status === 'not_received').length;

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Deliverability Report
        </h2>
        <p className="text-gray-600">
          Test completed at {test.completedAt ? new Date(test.completedAt).toLocaleString() : 'N/A'}
        </p>
      </div>

      {/* Overall Score */}
      {test.overallScore !== undefined && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white text-center mb-8">
          <h3 className="text-lg font-semibold mb-2">Overall Deliverability Score</h3>
          <div className="text-5xl font-bold mb-2">
            {Math.round(test.overallScore)}%
          </div>
          <p className="text-blue-100">
            {deliveredCount} out of {safeResults.length} inboxes
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={shareReport}
          className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
        >
          <Share className="w-5 h-5" />
          <span>Share Report</span>
        </button>
        <button
          onClick={exportPDF}
          className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
        >
          <Download className="w-5 h-5" />
          <span>Export PDF</span>
        </button>
      </div>

      {/* Results Table */}
      <div className="space-y-4">
        {safeResults.map((result, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-6 border border-gray-200 rounded-xl"
          >
            <div className="flex items-center space-x-4">
              {getStatusIcon(result.status)}
              <div>
                <p className="font-semibold text-gray-900 capitalize">
                  {result.provider || 'Unknown'}
                </p>
                <p className="text-gray-600 text-sm">{result.email || '-'}</p>
              </div>
            </div>
            
            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(result.status)}`}>
                {result.folder || result.status || 'unknown'}
              </span>
              {result.receivedAt && (
                <p className="text-gray-500 text-sm mt-1">
                  {new Date(result.receivedAt).toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-8 p-6 bg-gray-50 rounded-xl">
        <h4 className="font-semibold text-gray-900 mb-3">Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {deliveredCount}
            </div>
            <div className="text-sm text-gray-600">Inbox</div>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {spamCount}
            </div>
            <div className="text-sm text-gray-600">Spam</div>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {promoCount}
            </div>
            <div className="text-sm text-gray-600">Promotions</div>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">
              {notReceivedCount}
            </div>
            <div className="text-sm text-gray-600">Not Received</div>
          </div>
        </div>
      </div>
    </div>
  );
}