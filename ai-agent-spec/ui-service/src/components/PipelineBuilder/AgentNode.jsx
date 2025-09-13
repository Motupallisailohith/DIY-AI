import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const AgentNode = ({ data, isConnectable }) => {
  return (
    <div style={{
      padding: '10px',
      borderRadius: '8px',
      border: '2px solid #3b82f6',
      backgroundColor: 'white',
      minWidth: '150px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        style={{ background: '#3b82f6' }}
      />
      
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          fontSize: '12px', 
          color: '#6b7280', 
          marginBottom: '4px' 
        }}>
          🤖 AI Agent
        </div>
        <div style={{ 
          fontWeight: 'bold', 
          fontSize: '14px',
          marginBottom: '4px'
        }}>
          {data.label}
        </div>
        {data.agentId && (
          <div style={{ 
            fontSize: '10px', 
            color: '#9ca3af',
            fontFamily: 'monospace'
          }}>
            {data.agentId}
          </div>
        )}
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        style={{ background: '#10b981' }}
      />
      
      {/* Error output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="error"
        isConnectable={isConnectable}
        style={{ 
          background: '#ef4444',
          top: '50%',
          right: '-8px'
        }}
      />
    </div>
  );
};

export default memo(AgentNode);