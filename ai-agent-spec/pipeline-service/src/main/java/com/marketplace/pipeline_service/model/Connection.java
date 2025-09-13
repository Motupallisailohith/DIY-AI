package com.marketplace.pipeline_service.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;

import java.util.UUID;

@Entity
@Table(name = "pipeline_connections")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Connection {
    
    @Id
    @GeneratedValue
    private UUID id;
    
    @Column(nullable = false)
    private String sourceStepId;
    
    @Column(nullable = false)
    private String targetStepId;
    
    // Output port from source step (e.g., "success", "error", "data")
    private String sourcePort = "default";
    
    // Input port to target step (e.g., "input", "trigger")
    private String targetPort = "default";
    
    // Data transformation between steps
    @Column(columnDefinition = "jsonb")
    private String dataMapping; // JSONPath or JavaScript for data transformation
    
    // Conditional connection
    @Column(columnDefinition = "text")
    private String condition; // When this connection should be followed
    
    @Enumerated(EnumType.STRING)
    private ConnectionType connectionType = ConnectionType.DATA;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pipeline_id")
    @JsonBackReference
    private Pipeline pipeline;
    
    public enum ConnectionType {
        DATA,      // Normal data flow
        SUCCESS,   // Success path
        ERROR,     // Error handling path
        TRIGGER,   // Trigger connection
        CONDITION  // Conditional branch
    }
}