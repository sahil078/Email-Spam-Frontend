export type Folder = 'inbox' | 'spam' | 'promotions' | 'not_received';

export interface TestResult {
    provider: string;
    email: string;
    status: 'delivered' | 'spam' | 'promotions' | 'not_received' | 'pending';
    folder: string;
    receivedAt?: Date;
  }
  
export interface TestInboxResult {
  provider: string;
  email: string;
  received?: boolean;
  folder?: Folder;
  score?: number;
}

export interface SpamTest {
  id?: string;
  testCode: string;
  userId: string;
  status: 'pending' | 'completed' | 'failed';
  results: TestResult[];
  createdAt: Date;
  completedAt?: Date;
  overallScore?: number;
}