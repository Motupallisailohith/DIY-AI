// runner-service/src/main/java/com/marketplace/runner_service/AgentSpec.java
package com.marketplace.runner_service;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AgentSpec {
    private String agentId;
    private String dockerImage;
    private String inputSchemaJson;
    private String outputSchemaJson;
    private String healthEndpoint;
}