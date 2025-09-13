package com.marketplace.pipeline_service.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;

import java.util.UUID;

@Entity
@Table(name = "pipeline_steps")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PipelineStep {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String stepId; // Unique within pipeline (e.g., "content-generator-1")

    @Column(nullable = false)
    private String agentId; // Reference to agent in catalog service

    @Column(nullable = false)
    private String displayName;

    private String description;

    // Visual positioning for drag-and-drop UI
    private Double positionX;
    private Double positionY;

    // Step configuration
    @Column(columnDefinition = "jsonb")
    private String inputMapping; // How to map inputs from previous steps

    @Column(columnDefinition = "jsonb")
    private String outputMapping; // How to expose outputs to next steps

    @Column(columnDefinition = "jsonb")
    private String staticConfig; // Static configuration for this step

    // Execution settings
    private Integer timeoutSeconds = 300;
    private Integer maxRetries = 3;
    private Boolean enabled = true;

    // Conditional execution
    @Column(columnDefinition = "text")
    private String condition; // JavaScript expression for conditional execution

    @Enumerated(EnumType.STRING)
    private StepType stepType = StepType.AGENT;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pipeline_id")
    @JsonBackReference
    private Pipeline pipeline;

    public enum StepType {
        AGENT, // Regular AI agent
        TRIGGER, // Pipeline trigger (webhook, schedule, etc.)
        CONDITION, // Conditional branching
        LOOP, // Loop/iteration
        PARALLEL, // Parallel execution
        HUMAN_APPROVAL, // Human approval step
        DELAY, // Wait/delay step
        WEBHOOK // External webhook call
    }
}