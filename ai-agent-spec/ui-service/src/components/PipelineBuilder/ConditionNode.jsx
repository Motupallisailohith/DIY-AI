import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const ConditionNode = ({ data, isConnectable }) => {
  return (
    <div className="condition-node" style={{
      padding: '10px',
      borderRadius: '8px',
      border: '2px solid #f59e0b',
      backgroundColor: 'white',
      minWidth: '120px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        style={{ background: '#f59e0b' }}
      />
      
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          fontSize: '12px', 
          color: '#6b7280', 
          marginBottom: '4px' 
        }}>
          🔀 Condition
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
          if/else logic
        </div>
      </div>
      
      {/* True path */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        isConnectable={isConnectable}
        style={{ 
          background: '#10b981',
          left: '25%'
        }}
      />
      
      {/* False path */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        isConnectable={isConnectable}
        style={{ 
          background: '#ef4444',
          left: '75%'
        }}
      />
    </div>
  );
};

export default memo(ConditionNode);