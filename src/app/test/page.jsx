'use client';

import { useState } from 'react';
import { runMongoDiagnosticAction } from '@/app/actions/testMongoAction';

export default function MongoTestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleTest = async () => {
    setLoading(true);
    setResult(null);
    const response = await runMongoDiagnosticAction();
    setResult(response);
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', fontFamily: 'monospace' }}>
      <h1>MongoDB Connection Diagnostic Tool</h1>
      <p>Test MongoDB connection independently from Supabase image uploads.</p>

      <button
        onClick={handleTest}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#ccc' : '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
        }}
      >
        {loading ? 'Testing Connection...' : 'Run MongoDB Diagnostic'}
      </button>

      {result && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Diagnostic Results</h2>

          <div
            style={{
              padding: '1rem',
              borderRadius: '5px',
              backgroundColor: result.success ? '#e6fffa' : '#ffebe9',
              border: `1px solid ${result.success ? '#319795' : '#e53e3e'}`,
              marginBottom: '1rem',
            }}
          >
            <strong>Status:</strong> {result.success ? '✅ CONNECTED & WRITTEN' : '❌ FAILED'}
          </div>

          <h3>Execution Steps Log:</h3>
          <pre
            style={{
              backgroundColor: '#1a202c',
              color: '#f7fafc',
              padding: '1rem',
              borderRadius: '5px',
              overflowX: 'auto',
            }}
          >
            {result.logs.join('\n')}
          </pre>

          {!result.success && result.stack && (
            <>
              <h3 style={{ color: '#e53e3e' }}>Error Stack Trace:</h3>
              <pre
                style={{
                  backgroundColor: '#fff5f5',
                  color: '#c53030',
                  padding: '1rem',
                  borderRadius: '5px',
                  overflowX: 'auto',
                  border: '1px solid #feb2b2',
                }}
              >
                {result.stack}
              </pre>
            </>
          )}
        </div>
      )}
    </div>
  );
}