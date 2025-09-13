package com.marketplace.pipeline_service.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "pipeline_templates")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PipelineTemplate {
    
    @Id
    @GeneratedValue
    private UUID id;
    
    @Column(nullable = false, unique = true)
    private String templateId;
    
    @Column(nullable = false)
    private String displayName;
    
    private String description;
    
    @Column(nullable = false)
    private String category;
    
    @Column(nullable = false)
    private String version;
    
    private String author;
    
    @Column(columnDefinition = "jsonb")
    private String tags; // JSON array of tags
    
    // Template configuration schema
    @Column(columnDefinition = "jsonb")
    private String configurationSchema; // JSON Schema for user inputs
    
    // Pipeline definition
    @Column(columnDefinition = "jsonb")
    private String pipelineDefinition; // Complete pipeline structure
    
    // Usage statistics
    private Long usageCount = 0L;
    private Double averageRating = 0.0;
    
    @Column(nullable = false)
    private Instant createdAt = Instant.now();
    
    private Instant updatedAt = Instant.now();
    
    @Enumerated(EnumType.STRING)
    private TemplateStatus status = TemplateStatus.DRAFT;
    
    // Template metadata
    @Column(columnDefinition = "jsonb")
    private String requiredCredentials; // List of required API keys/secrets
    
    @Column(columnDefinition = "jsonb")
    private String estimatedCost; // Cost estimation per execution
    
    public enum TemplateStatus {
        DRAFT, PUBLISHED, DEPRECATED, FEATURED
    }
}