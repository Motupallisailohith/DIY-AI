package com.marketplace.pipeline_service.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PipelineExecuteRequest {
    
    // Initial input data for the pipeline
    private Map<String, Object> input;
    
    // Execution context
    private String triggeredBy;
    private String executionMode = "sync"; // sync, async
    
    // Override settings for this execution
    private Map<String, Object> overrides;
    
    // Callback configuration for async execution
    private String callbackUrl;
    private Map<String, String> callbackHeaders;
}