import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TemplateMarketplace = ({ onSelectTemplate, onClose }) => {
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
    fetchCategories();
  }, [selectedCategory]);

  const fetchTemplates = async () => {
    try {
      const params = selectedCategory !== 'all' ? { category: selectedCategory } : {};
      const response = await axios.get('/api/templates', { params });
      setTemplates(response.data);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      // Mock data for demo
      setTemplates([
        {
          templateId: 'social-media-automation',
          displayName: 'Social Media Automation',
          description: 'Complete social media content creation and publishing pipeline',
          category: 'social-media',
          author: 'Platform Team',
          usageCount: 1250,
          averageRating: 4.8,
          tags: ['social-media', 'content', 'automation'],
          requiredCredentials: ['OPENAI_API_KEY', 'FACEBOOK_TOKEN', 'TWITTER_API_KEY'],
          estimatedCost: '$0.50 per execution'
        },
        {
          templateId: 'content-research-pipeline',
          displayName: 'Content Research & Analysis',
          description: 'Research trending topics and generate content insights',
          category: 'research',
          author: 'Research Team',
          usageCount: 890,
          averageRating: 4.6,
          tags: ['research', 'seo', 'content'],
          requiredCredentials: ['SERP_API_KEY', 'OPENAI_API_KEY'],
          estimatedCost: '$0.25 per execution'
        },
        {
          templateId: 'email-marketing-automation',
          displayName: 'Email Marketing Automation',
          description: 'Automated email campaign creation and sending',
          category: 'marketing',
          author: 'Marketing Team',
          usageCount: 650,
          averageRating: 4.4,
          tags: ['email', 'marketing', 'automation'],
          requiredCredentials: ['GMAIL_API_KEY', 'MAILCHIMP_API_KEY'],
          estimatedCost: '$0.15 per execution'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/templates/categories');
      setCategories(['all', ...response.data]);
    } catch (error) {
      setCategories(['all', 'social-media', 'research', 'marketing', 'analytics']);
    }
  };

  const filteredTemplates = templates.filter(template =>
    template.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleUseTemplate = (template) => {
    onSelectTemplate(template);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '1200px',
        height: '80%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
            🏪 Template Marketplace
          </h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Sidebar */}
          <div style={{
            width: '250px',
            backgroundColor: '#f9fafb',
            borderRight: '1px solid #e5e7eb',
            padding: '20px',
            overflowY: 'auto'
          }}>
            {/* Search */}
            <input
              type="text"
              placeholder="Search templates..."
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
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
              Categories
            </h3>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '8px 12px',
                  marginBottom: '4px',
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: selectedCategory === category ? '#3b82f6' : 'transparent',
                  color: selectedCategory === category ? 'white' : '#374151',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '14px',
                  textTransform: 'capitalize'
                }}
              >
                {category.replace('-', ' ')}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                Loading templates...
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '20px'
              }}>
                {filteredTemplates.map(template => (
                  <div
                    key={template.templateId}
                    style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '20px',
                      backgroundColor: 'white',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ marginBottom: '12px' }}>
                      <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>
                        {template.displayName}
                      </h3>
                      <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                        {template.description}
                      </p>
                    </div>

                    {/* Stats */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                      fontSize: '12px',
                      color: '#6b7280'
                    }}>
                      <span>👥 {template.usageCount} uses</span>
                      <span>⭐ {template.averageRating}/5.0</span>
                      <span>💰 {template.estimatedCost}</span>
                    </div>

                    {/* Tags */}
                    <div style={{ marginBottom: '16px' }}>
                      {template.tags?.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          style={{
                            display: 'inline-block',
                            padding: '2px 8px',
                            marginRight: '4px',
                            marginBottom: '4px',
                            backgroundColor: '#e5e7eb',
                            borderRadius: '12px',
                            fontSize: '11px',
                            color: '#374151'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Required Credentials */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                        Required credentials:
                      </div>
                      <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                        {template.requiredCredentials?.join(', ')}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleUseTemplate(template)}
                        style={{
                          flex: 1,
                          padding: '8px 16px',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        Use Template
                      </button>
                      <button
                        style={{
                          padding: '8px 12px',
                          backgroundColor: 'transparent',
                          color: '#6b7280',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        Preview
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateMarketplace;