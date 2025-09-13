import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const ApprovalNode = ({ data, isConnectable }) => {
  return (
    <div className="approval-node" style={{
      padding: '10px',
      borderRadius: '8px',
      border: '2px solid #ef4444',
      backgroundColor: 'white',
      minWidth: '120px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        style={{ background: '#ef4444' }}
      />
      
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          fontSize: '12px', 
          color: '#6b7280', 
          marginBottom: '4px' 
        }}>
          ✋ Approval
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
          human review
        </div>
      </div>
      
      {/* Approved path */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="approved"
        isConnectable={isConnectable}
        style={{ 
          background: '#10b981',
          left: '25%'
        }}
      />
      
      {/* Rejected path */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="rejected"
        isConnectable={isConnectable}
        style={{ 
          background: '#ef4444',
          left: '75%'
        }}
      />
    </div>
  );
};

export default memo(ApprovalNode);