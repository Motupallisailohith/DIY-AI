import React, { useCallback, useState, useRef } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ConnectionLineType,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';

import AgentNode from './AgentNode';
import TriggerNode from './TriggerNode';
import ConditionNode from './ConditionNode';
import ApprovalNode from './ApprovalNode';
import Sidebar from './Sidebar';
import ExecutionPanel from './ExecutionPanel';
import TemplateMarketplace from '../TemplateMarketplace/TemplateMarketplace';

const nodeTypes = {
  agent: AgentNode,
  trigger: TriggerNode,
  condition: ConditionNode,
  approval: ApprovalNode,
};

const initialNodes = [
  {
    id: 'trigger-1',
    type: 'trigger',
    position: { x: 100, y: 100 },
    data: { 
      label: 'Pipeline Trigger',
      triggerType: 'manual',
      config: {}
    },
  },
];

const PipelineCanvas = ({ pipelineId, onSave, onExecute }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResults, setExecutionResults] = useState(null);
  const [showTemplateMarketplace, setShowTemplateMarketplace] = useState(false);
  
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({
      ...params,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#3b82f6', strokeWidth: 2 }
    }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const agentData = JSON.parse(event.dataTransfer.getData('application/reactflow'));

      if (typeof agentData === 'undefined' || !agentData) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: `${agentData.type}-${Date.now()}`,
        type: agentData.type,
        position,
        data: {
          label: agentData.displayName || agentData.agentId,
          agentId: agentData.agentId,
          config: agentData.config || {},
          inputSchema: agentData.inputSchema,
          outputSchema: agentData.outputSchema,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const handleSavePipeline = useCallback(async () => {
    const pipelineData = {
      pipelineId: pipelineId || `pipeline-${Date.now()}`,
      displayName: `AI Pipeline ${new Date().toLocaleDateString()}`,
      description: 'Created with visual pipeline builder',
      createdBy: 'current-user', // TODO: Get from auth context
      canvasLayout: {
        viewport: reactFlowInstance?.getViewport(),
        zoom: reactFlowInstance?.getZoom(),
      },
      steps: nodes.map(node => ({
        stepId: node.id,
        agentId: node.data.agentId,
        displayName: node.data.label,
        positionX: node.position.x,
        positionY: node.position.y,
        staticConfig: node.data.config,
        stepType: node.type.toUpperCase(),
        enabled: true,
      })),
      connections: edges.map(edge => ({
        sourceStepId: edge.source,
        targetStepId: edge.target,
        sourcePort: edge.sourceHandle || 'default',
        targetPort: edge.targetHandle || 'default',
        connectionType: 'DATA',
      })),
    };

    try {
      await onSave(pipelineData);
    } catch (error) {
      console.error('Failed to save pipeline:', error);
    }
  }, [nodes, edges, reactFlowInstance, pipelineId, onSave]);

  const handleExecutePipeline = useCallback(async () => {
    if (!pipelineId) {
      alert('Please save the pipeline first');
      return;
    }

    setIsExecuting(true);
    try {
      const result = await onExecute(pipelineId, {
        input: { message: 'Test execution' },
        triggeredBy: 'manual',
        executionMode: 'sync',
      });
      setExecutionResults(result);
    } catch (error) {
      console.error('Pipeline execution failed:', error);
      setExecutionResults({ error: error.message });
    } finally {
      setIsExecuting(false);
    }
  }, [pipelineId, onExecute]);

  return (
    <div className="pipeline-builder" style={{ width: '100vw', height: '100vh', display: 'flex' }}>
      {/* Agent Marketplace Sidebar */}
      <Sidebar onNodeDrag={(agentData) => {
        // This will be handled by the onDrop event
      }} />
      
      {/* Main Canvas */}
      <div className="reactflow-wrapper" ref={reactFlowWrapper} style={{ flexGrow: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
          
          {/* Action Panel */}
          <Panel position="top-right">
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => setShowTemplateMarketplace(true)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                🏪 Templates
              </button>
              <button 
                onClick={handleSavePipeline}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Save Pipeline
              </button>
              <button 
                onClick={handleExecutePipeline}
                disabled={isExecuting}
                style={{
                  padding: '8px 16px',
                  backgroundColor: isExecuting ? '#6b7280' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isExecuting ? 'not-allowed' : 'pointer'
                }}
              >
                {isExecuting ? 'Executing...' : 'Execute Pipeline'}
              </button>
            </div>
          </Panel>
        </ReactFlow>
      </div>
      
      {/* Properties Panel */}
      {selectedNode && (
        <div style={{ 
          width: '300px', 
          backgroundColor: '#f9fafb', 
          borderLeft: '1px solid #e5e7eb',
          padding: '20px'
        }}>
          <h3>Node Properties</h3>
          <div>
            <strong>Type:</strong> {selectedNode.type}
          </div>
          <div>
            <strong>Label:</strong> {selectedNode.data.label}
          </div>
          {selectedNode.data.agentId && (
            <div>
              <strong>Agent ID:</strong> {selectedNode.data.agentId}
            </div>
          )}
          {/* TODO: Add editable configuration form */}
        </div>
      )}
      
      {/* Execution Results Panel */}
      {executionResults && (
        <ExecutionPanel 
          results={executionResults} 
          onClose={() => setExecutionResults(null)} 
        />
      )}
      
      {/* Template Marketplace */}
      {showTemplateMarketplace && (
        <TemplateMarketplace 
          onSelectTemplate={(template) => {
            // Load template into canvas
            console.log('Selected template:', template);
            setShowTemplateMarketplace(false);
            // TODO: Implement template loading
          }}
          onClose={() => setShowTemplateMarketplace(false)}
        />
      )}
    </div>
  );
};

export default PipelineCanvas;