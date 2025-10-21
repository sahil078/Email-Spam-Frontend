import { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { testApi, authApi } from '../lib/api';
import { SpamTest } from '../types';

interface TestCreationProps {
  onTestCreated: (test: SpamTest, userEmail: string) => void;
}

export function TestCreation({ onTestCreated }: TestCreationProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Identify user
      await authApi.identify(email);
      
      // Create test
      const response = await testApi.createTest(email);
      onTestCreated(response.data, email);
    } catch (err: unknown) {
      if (err instanceof Error && 'response' in err) {
        setError(
          (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to create test'
        );
      } else {
        setError('Failed to create test');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Mail className="w-10 h-10 text-blue-600" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Start Your Email Deliverability Test
      </h2>
      
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Enter your email address to generate a unique test code and get started 
        with testing your email deliverability.
      </p>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            'Creating Test...'
          ) : (
            <>
              Generate Test Code
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg max-w-md mx-auto">
        <h3 className="font-semibold text-gray-900 mb-2">How it works:</h3>
        <ol className="text-sm text-gray-600 text-left space-y-2">
          <li>1. Enter your email to get a unique test code</li>
          <li>2. Send an email to our test addresses with the code</li>
          <li>3. We`ll analyze where your email landed</li>
          <li>4. Get your comprehensive deliverability report</li>
        </ol>
      </div>
    </div>
  );
}