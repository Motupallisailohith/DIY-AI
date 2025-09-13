import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PipelineCanvas from './components/PipelineBuilder/PipelineCanvas';
import axios from 'axios';
import './App.css';

// Configure axios defaults
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8082';

function App() {
  const handleSavePipeline = async (pipelineData) => {
    try {
      const response = await axios.post('/api/pipelines', pipelineData);
      console.log('Pipeline saved:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to save pipeline:', error);
      throw error;
    }
  };

  const handleExecutePipeline = async (pipelineId, executeRequest) => {
    try {
      const response = await axios.post(`/api/pipelines/${pipelineId}/execute`, executeRequest);
      console.log('Pipeline executed:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to execute pipeline:', error);
      throw error;
    }
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              <PipelineCanvas 
                onSave={handleSavePipeline}
                onExecute={handleExecutePipeline}
              />
            } 
          />
          <Route 
            path="/pipeline/:pipelineId" 
            element={
              <PipelineCanvas 
                onSave={handleSavePipeline}
                onExecute={handleExecutePipeline}
              />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;