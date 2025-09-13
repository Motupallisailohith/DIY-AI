package com.marketplace.catalog_service.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.Instant;
import java.util.UUID;

@Entity 
@Table(name="agents")
@Getter 
@Setter
public class AgentRecord {
  @Id @GeneratedValue private UUID id;

  @Column(nullable=false, unique=true) private String agentId;
  @Column(nullable=false) private String displayName;
  @Column(nullable=false) private String version;
  @Column(nullable=false) private String dockerImage;
  @Column(nullable=false) private String healthEndpoint;

  @Column(columnDefinition = "jsonb") private String inputSchemaJson;
  @Column(columnDefinition = "jsonb") private String resourceLimitsJson;
  @Column(columnDefinition = "jsonb") private String secretsJson;
  @Column(columnDefinition = "jsonb") private String metadataJson;

  @Column(nullable=false) private Instant createdAt = Instant.now();
}
