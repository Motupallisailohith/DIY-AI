package com.marketplace.pipeline_service.controller;

import com.marketplace.pipeline_service.model.Pipeline;
import com.marketplace.pipeline_service.model.PipelineExecution;
import com.marketplace.pipeline_service.service.PipelineService;
import com.marketplace.pipeline_service.service.WorkflowExecutor;
import com.marketplace.pipeline_service.dto.PipelineCreateRequest;
import com.marketplace.pipeline_service.dto.PipelineExecuteRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pipelines")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // For frontend development
public class PipelineController {
    
    private final PipelineService pipelineService;
    private final WorkflowExecutor workflowExecutor;
    
    // Pipeline CRUD operations
    @GetMapping
    public ResponseEntity<List<Pipeline>> getAllPipelines(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(pipelineService.getAllPipelines(page, size));
    }
    
    @GetMapping("/{pipelineId}")
    public ResponseEntity<Pipeline> getPipeline(@PathVariable String pipelineId) {
        return pipelineService.getPipelineById(pipelineId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Pipeline> createPipeline(@RequestBody PipelineCreateRequest request) {
        Pipeline pipeline = pipelineService.createPipeline(request);
        return ResponseEntity.ok(pipeline);
    }
    
    @PutMapping("/{pipelineId}")
    public ResponseEntity<Pipeline> updatePipeline(
            @PathVariable String pipelineId,
            @RequestBody PipelineCreateRequest request) {
        Pipeline pipeline = pipelineService.updatePipeline(pipelineId, request);
        return ResponseEntity.ok(pipeline);
    }
    
    @DeleteMapping("/{pipelineId}")
    public ResponseEntity<Void> deletePipeline(@PathVariable String pipelineId) {
        pipelineService.deletePipeline(pipelineId);
        return ResponseEntity.noContent().build();
    }
    
    // Pipeline execution
    @PostMapping("/{pipelineId}/execute")
    public ResponseEntity<PipelineExecution> executePipeline(
            @PathVariable String pipelineId,
            @RequestBody PipelineExecuteRequest request) {
        PipelineExecution execution = workflowExecutor.executePipeline(pipelineId, request);
        return ResponseEntity.ok(execution);
    }
    
    @GetMapping("/{pipelineId}/executions")
    public ResponseEntity<List<PipelineExecution>> getPipelineExecutions(
            @PathVariable String pipelineId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        List<PipelineExecution> executions = pipelineService.getPipelineExecutions(pipelineId, page, size);
        return ResponseEntity.ok(executions);
    }
    
    @GetMapping("/executions/{executionId}")
    public ResponseEntity<PipelineExecution> getExecution(@PathVariable String executionId) {
        return pipelineService.getExecutionById(executionId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Pipeline validation
    @PostMapping("/{pipelineId}/validate")
    public ResponseEntity<Map<String, Object>> validatePipeline(@PathVariable String pipelineId) {
        Map<String, Object> validation = pipelineService.validatePipeline(pipelineId);
        return ResponseEntity.ok(validation);
    }
    
    // Pipeline publishing
    @PostMapping("/{pipelineId}/publish")
    public ResponseEntity<Pipeline> publishPipeline(@PathVariable String pipelineId) {
        Pipeline pipeline = pipelineService.publishPipeline(pipelineId);
        return ResponseEntity.ok(pipeline);
    }
}