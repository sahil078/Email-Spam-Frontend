'use client';

import { useState } from 'react';
import { TestCreation } from '@/components/TestCreation';
import { TestInboxes } from '../components/TestInboxes';
import { TestReport } from '@/components/TestReport';
import { SpamTest } from '../types';

export default function Home() {
  const [currentTest, setCurrentTest] = useState<SpamTest | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [activeTab, setActiveTab] = useState<'create' | 'inboxes' | 'report'>('create');

  const handleTestCreated = (test: SpamTest, email: string) => {
    setCurrentTest(test);
    setUserEmail(email);
    setActiveTab('inboxes');
  };

  const handleTestProcessed = (test: SpamTest) => {
    setCurrentTest(test);
    setActiveTab('report');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Email Spam Report Tool
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Test your email deliverability across major providers. 
            Get instant reports on where your emails land.
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-8">
              {[
                { id: 'create', label: '1. Create Test' },
                { id: 'inboxes', label: '2. Send Email' },
                { id: 'report', label: '3. View Report' }
              ].map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      activeTab === step.id 
                        ? 'bg-blue-600 border-blue-600 text-white' 
                        : index < ['create', 'inboxes', 'report'].indexOf(activeTab)
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 text-gray-500'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className={`ml-2 font-medium ${
                    activeTab === step.id ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </span>
                  {index < 2 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      index < ['create', 'inboxes', 'report'].indexOf(activeTab) 
                        ? 'bg-green-500' 
                        : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {activeTab === 'create' && (
              <TestCreation onTestCreated={handleTestCreated} />
            )}
            
            {activeTab === 'inboxes' && currentTest && (
              <TestInboxes 
                test={currentTest}
                userEmail={userEmail}
                onTestProcessed={handleTestProcessed}
              />
            )}
            
            {activeTab === 'report' && currentTest && (
              <TestReport test={currentTest} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}