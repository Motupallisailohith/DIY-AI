import React from 'react';

const ExecutionPanel = ({ results, onClose }) => {
  return (
    <div className="execution-panel" style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '400px',
      maxHeight: '300px',
      background: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      padding: '16px',
      overflowY: 'auto',
      zIndex: 1000
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
          🚀 Execution Results
        </h3>
        <button 
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: '#6b7280'
          }}
        >
          ×
        </button>
      </div>
      
      {results.error ? (
        <div style={{
          padding: '12px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '6px',
          color: '#dc2626'
        }}>
          <strong>Error:</strong> {results.error}
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '12px' }}>
            <strong>Status:</strong> 
            <span style={{ 
              marginLeft: '8px',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              backgroundColor: results.status === 'COMPLETED' ? '#dcfce7' : '#fef3c7',
              color: results.status === 'COMPLETED' ? '#166534' : '#92400e'
            }}>
              {results.status || 'COMPLETED'}
            </span>
          </div>
          
          {results.executionId && (
            <div style={{ marginBottom: '8px', fontSize: '12px', color: '#6b7280' }}>
              <strong>Execution ID:</strong> {results.executionId}
            </div>
          )}
          
          {results.executionTimeMs && (
            <div style={{ marginBottom: '8px', fontSize: '12px', color: '#6b7280' }}>
              <strong>Duration:</strong> {results.executionTimeMs}ms
            </div>
          )}
          
          {results.finalOutput && (
            <div style={{ marginTop: '12px' }}>
              <strong>Output:</strong>
              <pre style={{
                marginTop: '8px',
                padding: '8px',
                backgroundColor: '#f3f4f6',
                borderRadius: '4px',
                fontSize: '12px',
                overflow: 'auto',
                maxHeight: '150px'
              }}>
                {typeof results.finalOutput === 'string' 
                  ? results.finalOutput 
                  : JSON.stringify(results.finalOutput, null, 2)
                }
              </pre>
            </div>
          )}
          
          {results.stepResults && (
            <div style={{ marginTop: '12px' }}>
              <strong>Step Results:</strong>
              <pre style={{
                marginTop: '8px',
                padding: '8px',
                backgroundColor: '#f3f4f6',
                borderRadius: '4px',
                fontSize: '12px',
                overflow: 'auto',
                maxHeight: '100px'
              }}>
                {JSON.stringify(results.stepResults, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExecutionPanel;