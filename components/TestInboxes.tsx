import { useState, useEffect } from 'react';
import { Copy, Mail, Check, RefreshCw, Send } from 'lucide-react';
import { testApi } from '@/lib/api';
import { SpamTest } from '../types';

interface TestInboxesProps {
  test: SpamTest;
  userEmail: string;
  onTestProcessed: (test: SpamTest) => void;
}

export function TestInboxes({ test, userEmail, onTestProcessed }: TestInboxesProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [userEmailInput, setUserEmailInput] = useState<string>('');

  const copyTestCode = () => {
    if (test?.testCode) {
      navigator.clipboard.writeText(test.testCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const checkResults = async () => {
    setIsProcessing(true);
    try {
      const response = await testApi.processTest(test.testCode);
      const incoming = response.data?.data ?? response.data?.result;
      onTestProcessed(incoming ? { ...test, ...incoming } : test);
    } catch (error) {
      console.error('Error processing test:', error);
    } finally {
      setIsProcessing(false);
      setLastChecked(new Date());
    }
  };

  // Single handler to send the email TO the user-entered email (or the provided userEmail)
  const handleSendTestEmail = async () => {
    if (!test?.testCode) return;

    const recipient = (userEmailInput || userEmail || '').trim();
    if (!recipient) {
      console.error('Recipient email is required');
      return;
    }

    setIsSending(true);
    try {
      await testApi.sendTestEmail({
        testCode: test.testCode, // fix: use test.testCode (no undefined symbol)
        subject: `[EmailSpan Test] ${test.testCode}`,
        body: `This is a deliverability test.\nTest Code: ${test.testCode}\nSent to: ${recipient}`,
        recipients: [recipient],      // TO = user input (or userEmail fallback)
        fromName: 'EmailSpan',        // display name only; actual from is AUTHORIZED_EMAIL on backend
      });
    } catch (e) {
      console.error('Error sending test email', e);
    } finally {
      setIsSending(false);
    }
  };

  // Auto-check every 30 seconds
  useEffect(() => {
    if (test.status === 'pending') {
      const interval = setInterval(checkResults, 30000);
      return () => clearInterval(interval);
    }
  }, [test.status]);

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Send Your Test Email
        </h2>
        <p className="text-gray-600">
          Copy the test code and include it in your email subject or body
        </p>
      </div>

      {/* Test Code */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Your Test Code</h3>
            <p className="text-blue-700 font-mono text-lg">{test?.testCode ?? 'N/A'}</p>
            <p className="text-blue-600 text-sm mt-1">
              Include this code in your email`s subject or body
            </p>
          </div>
          <button
            onClick={copyTestCode}
            className="flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-lg border border-blue-200 hover:bg-blue-50"
          >
            {copiedCode ? (
              <Check className="w-5 h-5" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
            <span>{copiedCode ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
        <h4 className="font-semibold text-yellow-900 mb-2">Instructions:</h4>
        <ol className="text-yellow-800 space-y-2 text-sm">
          <li>1. Enter the recipient email below.</li>
          <li>2. ``Click Send Test Email`` to send from our authorized sender.</li>
          <li>3. ``Click Check Results`` to see delivery status.</li>
        </ol>
      </div>

      {/* Recipient Email Input */}
      <div className="mb-6">
        <label htmlFor="userEmailInput" className="block text-sm font-medium text-gray-700">
          Recipient Email
        </label>
        <input
          id="userEmailInput"
          type="email"
          value={userEmailInput}
          onChange={(e) => setUserEmailInput(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder={userEmail || 'Enter recipient email'}
        />
        <p className="text-xs text-gray-500 mt-1">
          Email will be sent from our authorized sender to the address above.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleSendTestEmail}  // fix: call the correct handler
          disabled={isSending}
          className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 flex items-center"
        >
          {isSending ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Send Test Email
            </>
          )}
        </button>

        <button
          onClick={checkResults}
          disabled={isProcessing}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Checking...
            </>
          ) : (
            'Check Results'
          )}
        </button>
      </div>

      {lastChecked && (
        <p className="text-center text-gray-500 text-sm mt-4">
          Last checked: {lastChecked.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
