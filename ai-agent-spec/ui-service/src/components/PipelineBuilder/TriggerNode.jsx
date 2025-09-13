import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const TriggerNode = ({ data, isConnectable }) => {
  return (
    <div className="trigger-node" style={{
      padding: '10px',
      borderRadius: '8px',
      border: '2px solid #10b981',
      backgroundColor: 'white',
      minWidth: '120px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          fontSize: '12px', 
          color: '#6b7280', 
          marginBottom: '4px' 
        }}>
          🚀 Trigger
        </div>
        <div style={{ 
          fontWeight: 'bold', 
          fontSize: '14px',
          marginBottom: '4px'
        }}>
          {data.label}
        </div>
        <div style={{ 
          fontSize: '10px', 
          color: '#9ca3af'
        }}>
          {data.triggerType || 'manual'}
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        style={{ background: '#10b981' }}
      />
    </div>
  );
};

export default memo(TriggerNode);