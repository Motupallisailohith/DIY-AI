package com.marketplace.pipeline_service.controller;

import com.marketplace.pipeline_service.model.PipelineTemplate;
import com.marketplace.pipeline_service.model.Pipeline;
import com.marketplace.pipeline_service.service.TemplateService;
import com.marketplace.pipeline_service.dto.TemplateCreateRequest;
import com.marketplace.pipeline_service.dto.TemplateInstantiateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/templates")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TemplateController {
    
    private final TemplateService templateService;
    
    // Template marketplace
    @GetMapping
    public ResponseEntity<List<PipelineTemplate>> getAllTemplates(
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        List<PipelineTemplate> templates = templateService.getTemplates(category, page, size);
        return ResponseEntity.ok(templates);
    }
    
    @GetMapping("/featured")
    public ResponseEntity<List<PipelineTemplate>> getFeaturedTemplates() {
        List<PipelineTemplate> templates = templateService.getFeaturedTemplates();
        return ResponseEntity.ok(templates);
    }
    
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        List<String> categories = templateService.getCategories();
        return ResponseEntity.ok(categories);
    }
    
    @GetMapping("/{templateId}")
    public ResponseEntity<PipelineTemplate> getTemplate(@PathVariable String templateId) {
        return templateService.getTemplateById(templateId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Template management
    @PostMapping
    public ResponseEntity<PipelineTemplate> createTemplate(@RequestBody TemplateCreateRequest request) {
        PipelineTemplate template = templateService.createTemplate(request);
        return ResponseEntity.ok(template);
    }
    
    @PutMapping("/{templateId}")
    public ResponseEntity<PipelineTemplate> updateTemplate(
            @PathVariable String templateId,
            @RequestBody TemplateCreateRequest request) {
        PipelineTemplate template = templateService.updateTemplate(templateId, request);
        return ResponseEntity.ok(template);
    }
    
    // Template instantiation
    @PostMapping("/{templateId}/instantiate")
    public ResponseEntity<Pipeline> instantiateTemplate(
            @PathVariable String templateId,
            @RequestBody TemplateInstantiateRequest request) {
        Pipeline pipeline = templateService.instantiateTemplate(templateId, request);
        return ResponseEntity.ok(pipeline);
    }
    
    // Template validation
    @PostMapping("/{templateId}/validate")
    public ResponseEntity<Map<String, Object>> validateTemplate(@PathVariable String templateId) {
        Map<String, Object> validation = templateService.validateTemplate(templateId);
        return ResponseEntity.ok(validation);
    }
    
    // Template usage tracking
    @PostMapping("/{templateId}/usage")
    public ResponseEntity<Void> trackUsage(@PathVariable String templateId) {
        templateService.incrementUsage(templateId);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/{templateId}/rating")
    public ResponseEntity<Void> rateTemplate(
            @PathVariable String templateId,
            @RequestBody Map<String, Object> rating) {
        Double score = ((Number) rating.get("rating")).doubleValue();
        templateService.addRating(templateId, score);
        return ResponseEntity.ok().build();
    }
}