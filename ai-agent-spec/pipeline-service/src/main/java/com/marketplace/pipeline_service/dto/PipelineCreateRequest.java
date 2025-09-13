package com.marketplace.pipeline_service.dto;

import com.marketplace.pipeline_service.model.PipelineStep;
import com.marketplace.pipeline_service.model.Connection;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PipelineCreateRequest {
    
    private String pipelineId;
    private String displayName;
    private String description;
    private String createdBy;
    
    // Visual layout for the UI
    private Map<String, Object> canvasLayout;
    
    // Global pipeline configuration
    private Map<String, Object> globalConfig;
    
    // Pipeline steps (nodes in the visual editor)
    private List<StepDefinition> steps;
    
    // Connections between steps (edges in the visual editor)
    private List<ConnectionDefinition> connections;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StepDefinition {
        private String stepId;
        private String agentId;
        private String displayName;
        private String description;
        
        // Visual positioning
        private Double positionX;
        private Double positionY;
        
        // Configuration
        private Map<String, Object> inputMapping;
        private Map<String, Object> outputMapping;
        private Map<String, Object> staticConfig;
        
        // Execution settings
        private Integer timeoutSeconds;
        private Integer maxRetries;
        private Boolean enabled;
        private String condition;
        private PipelineStep.StepType stepType;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ConnectionDefinition {
        private String sourceStepId;
        private String targetStepId;
        private String sourcePort;
        private String targetPort;
        private Map<String, Object> dataMapping;
        private String condition;
        private Connection.ConnectionType connectionType;
    }
}