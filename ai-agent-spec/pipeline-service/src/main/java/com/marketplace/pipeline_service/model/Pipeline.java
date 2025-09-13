package com.marketplace.pipeline_service.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "pipelines")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pipeline {
    
    @Id
    @GeneratedValue
    private UUID id;
    
    @Column(nullable = false, unique = true)
    private String pipelineId;
    
    @Column(nullable = false)
    private String displayName;
    
    private String description;
    
    @Column(nullable = false)
    private String createdBy;
    
    @Column(nullable = false)
    private Instant createdAt = Instant.now();
    
    private Instant updatedAt = Instant.now();
    
    @Enumerated(EnumType.STRING)
    private PipelineStatus status = PipelineStatus.DRAFT;
    
    // Visual layout information for UI
    @Column(columnDefinition = "jsonb")
    private String canvasLayout; // Stores node positions, zoom level, etc.
    
    // Pipeline configuration
    @Column(columnDefinition = "jsonb")
    private String globalConfig; // Global variables, settings
    
    @OneToMany(mappedBy = "pipeline", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<PipelineStep> steps;
    
    @OneToMany(mappedBy = "pipeline", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Connection> connections;
    
    // Execution statistics
    private Long totalExecutions = 0L;
    private Long successfulExecutions = 0L;
    private Long failedExecutions = 0L;
    
    public enum PipelineStatus {
        DRAFT, PUBLISHED, ARCHIVED, DISABLED
    }
}