
package com.marketplace.runner_service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/runner")
@RequiredArgsConstructor
public class AgentRunnerController {

    private final AgentRunnerService runnerService;

    @PostMapping("/{agentId}")
    public ResponseEntity<?> runAgent(
            @PathVariable String agentId,
            @RequestBody Map<String, Object> input) {
        try {
            String output = runnerService.executeAgent(agentId, input);
            return ResponseEntity.ok(Map.of("output", output));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}