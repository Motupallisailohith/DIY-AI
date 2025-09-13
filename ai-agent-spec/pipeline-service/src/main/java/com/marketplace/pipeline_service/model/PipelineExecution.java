package com.marketplace.pipeline_service.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "pipeline_executions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PipelineExecution {
    
    @Id
    @GeneratedValue
    private UUID id;
    
    @Column(nullable = false)
    private String pipelineId;
    
    @Column(nullable = false)
    private String executionId; // Unique execution identifier
    
    @Column(nullable = false)
    private Instant startedAt = Instant.now();
    
    private Instant completedAt;
    
    @Enumerated(EnumType.STRING)
    private ExecutionStatus status = ExecutionStatus.RUNNING;
    
    // Execution context
    @Column(columnDefinition = "jsonb")
    private String initialInput; // Input that started the pipeline
    
    @Column(columnDefinition = "jsonb")
    private String finalOutput; // Final output of the pipeline
    
    @Column(columnDefinition = "jsonb")
    private String executionLog; // Detailed execution log
    
    @Column(columnDefinition = "jsonb")
    private String stepResults; // Results from each step
    
    // Error information
    private String errorMessage;
    private String errorStep; // Which step failed
    
    // Execution metadata
    private String triggeredBy; // User, webhook, schedule, etc.
    private Long executionTimeMs;
    
    public enum ExecutionStatus {
        RUNNING,
        COMPLETED,
        FAILED,
        CANCELLED,
        WAITING_APPROVAL
    }
}