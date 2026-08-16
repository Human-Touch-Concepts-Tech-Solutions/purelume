'use client';

import { useState } from 'react';
import { testSupabaseConnection } from './actions';

export default function TestSupabasePage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    const res = await testSupabaseConnection();
    setResult(res);
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>Supabase Storage Connection Test</h2>
      <button 
        onClick={handleTest} 
        disabled={loading}
        style={{
          padding: '0.8rem 1.5rem',
          background: 'var(--gold, #d6b36a)',
          color: '#fff',
          borderRadius: '6px',
          fontWeight: 'bold'
        }}
      >
        {loading ? 'Testing...' : 'Run Storage Test'}
      </button>

      {result && (
        <div style={{ marginTop: '1.5rem', background: '#f5f5f5', padding: '1rem', borderRadius: '8px' }}>
          <p><strong>Status:</strong> {result.success ? 'Success' : 'Failed'}</p>
          <p><strong>Message:</strong> {result.message}</p>
          {result.publicUrl && (
            <p>
              <strong>Test File URL:</strong>{' '}
              <a href={result.publicUrl} target="_blank" rel="noreferrer">
                {result.publicUrl}
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}