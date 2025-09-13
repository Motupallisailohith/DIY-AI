// runner-service/src/main/java/com/marketplace/runner_service/AgentRunnerService.java
package com.marketplace.runner_service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AgentRunnerService {

    private final WebClient webClient = WebClient.create("http://localhost:8081");

    public String executeAgent(String agentId, Map<String, Object> input) {
        // Step 1: Get agent metadata from catalog
        AgentSpec agent = fetchAgent(agentId);

        // Step 2: Pull Docker image (optional: use ProcessBuilder or Docker SDK)
        String image = agent.getDockerImage();
        pullDockerImage(image);

        // Step 3: Run container with input mounted or piped
        return runContainer(image, input);
    }

    private AgentSpec fetchAgent(String agentId) {
        return webClient.get()
                .uri("/agents")
                .retrieve()
                .bodyToFlux(AgentSpec.class)
                .blockFirst(agent -> agent.getAgentId().equals(agentId));
    }

    private void pullDockerImage(String image) {
        // Use Docker SDK or: ProcessBuilder pb = new ProcessBuilder("docker", "pull", image);
        // This method needs to be implemented.
    }

    private String runContainer(String image, Map<String, Object> input) {
        // This method needs to be implemented to execute the Docker container.
        return "some output";
    }
}