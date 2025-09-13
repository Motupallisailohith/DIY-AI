import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Sidebar = ({ onNodeDrag }) => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      // Fetch from catalog service
      const response = await axios.get('/api/agents');
      setAgents(response.data);
    } catch (error) {
      console.error('Failed to fetch agents:', error);
      // Mock data for development
      setAgents([
        {
          agentId: 'gpt4-content-generator',
          displayName: 'GPT-4 Content Generator',
          category: 'content',
          description: 'Generate content using GPT-4',
          inputSchema: { type: 'object', properties: { prompt: { type: 'string' } } },
          tags: ['llm', 'content', 'openai']
        },
        {
          agentId: 'image-generator',
          displayName: 'AI Image Generator',
          category: 'media',
          description: 'Create images using DALL-E or Pollinations',
          inputSchema: { type: 'object', properties: { prompt: { type: 'string' } } },
          tags: ['image', 'ai', 'generation']
        },
        {
          agentId: 'hashtag-generator',
          displayName: 'Hashtag Generator',
          category: 'social',
          description: 'Generate relevant hashtags for social media',
          inputSchema: { type: 'object', properties: { content: { type: 'string' } } },
          tags: ['social', 'hashtags', 'marketing']
        },
        {
          agentId: 'email-approval',
          displayName: 'Email Approval System',
          category: 'workflow',
          description: 'Send approval requests via email',
          inputSchema: { type: 'object', properties: { content: { type: 'string' } } },
          tags: ['approval', 'email', 'workflow']
        },
        {
          agentId: 'social-publisher',
          displayName: 'Social Media Publisher',
          category: 'social',
          description: 'Publish to multiple social platforms',
          inputSchema: { type: 'object', properties: { content: { type: 'string' } } },
          tags: ['social', 'publishing', 'automation']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'All Agents', icon: '🤖' },
    { id: 'content', name: 'Content', icon: '📝' },
    { id: 'media', name: 'Media', icon: '🎨' },
    { id: 'social', name: 'Social', icon: '📱' },
    { id: 'workflow', name: 'Workflow', icon: '⚙️' },
  ];

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || agent.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const onDragStart = (event, agent) => {
    const agentData = {
      ...agent,
      type: 'agent'
    };
    event.dataTransfer.setData('application/reactflow', JSON.stringify(agentData));
    event.dataTransfer.effectAllowed = 'move';
  };

  const specialNodes = [
    {
      id: 'trigger',
      displayName: 'Pipeline Trigger',
      description: 'Start point for your pipeline',
      icon: '🚀',
      type: 'trigger'
    },
    {
      id: 'condition',
      displayName: 'Condition',
      description: 'Conditional branching logic',
      icon: '🔀',
      type: 'condition'
    },
    {
      id: 'approval',
      displayName: 'Human Approval',
      description: 'Require human approval',
      icon: '✋',
      type: 'approval'
    },
    {
      id: 'delay',
      displayName: 'Delay',
      description: 'Wait for specified time',
      icon: '⏰',
      type: 'delay'
    }
  ];

  return (
    <div style={{
      width: '300px',
      backgroundColor: '#f9fafb',
      borderRight: '1px solid #e5e7eb',
      padding: '20px',
      overflowY: 'auto',
      height: '100vh'
    }}>
      <h2 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>
        🤖 Agent Marketplace
      </h2>
      
      {/* Search */}
      <input
        type="text"
        placeholder="Search agents..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: '100%',
          padding: '8px 12px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          marginBottom: '16px',
          fontSize: '14px'
        }}
      />
      
      {/* Categories */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
          Categories
        </h3>
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            style={{
              display: 'block',
              width: '100%',
              padding: '8px 12px',
              marginBottom: '4px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: selectedCategory === category.id ? '#3b82f6' : 'transparent',
              color: selectedCategory === category.id ? 'white' : '#374151',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '14px'
            }}
          >
            {category.icon} {category.name}
          </button>
        ))}
      </div>
      
      {/* Special Nodes */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
          Pipeline Components
        </h3>
        {specialNodes.map(node => (
          <div
            key={node.id}
            draggable
            onDragStart={(event) => onDragStart(event, node)}
            style={{
              padding: '12px',
              marginBottom: '8px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: 'white',
              cursor: 'grab',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.boxShadow = 'none';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ fontSize: '16px', marginBottom: '4px' }}>
              {node.icon} {node.displayName}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              {node.description}
            </div>
          </div>
        ))}
      </div>
      
      {/* AI Agents */}
      <div>
        <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
          AI Agents ({filteredAgents.length})
        </h3>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
            Loading agents...
          </div>
        ) : (
          filteredAgents.map(agent => (
            <div
              key={agent.agentId}
              draggable
              onDragStart={(event) => onDragStart(event, agent)}
              style={{
                padding: '12px',
                marginBottom: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: 'white',
                cursor: 'grab',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = 'none';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>
                🤖 {agent.displayName}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>
                {agent.description}
              </div>
              {agent.tags && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {agent.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      style={{
                        fontSize: '10px',
                        padding: '2px 6px',
                        backgroundColor: '#e5e7eb',
                        borderRadius: '10px',
                        color: '#374151'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;