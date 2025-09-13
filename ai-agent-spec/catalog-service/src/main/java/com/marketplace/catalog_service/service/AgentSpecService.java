package com.marketplace.catalog_service.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.marketplace.catalog_service.model.AgentRecord;
import com.marketplace.catalog_service.repo.AgentRepository;
import com.networknt.schema.JsonSchema;
import com.networknt.schema.ValidationMessage;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
public class AgentSpecService {
  private final JsonSchema schema;
  private final ObjectMapper mapper;
  private final AgentRepository repo;

  public AgentSpecService(JsonSchema schema, ObjectMapper mapper, AgentRepository repo) {
    this.schema = schema; this.mapper = mapper; this.repo = repo;
  }

  @Transactional
  public AgentRecord register(String rawJson) {
    try {
      JsonNode node = mapper.readTree(rawJson);
      Set<ValidationMessage> errors = schema.validate(node);
      System.out.println("Raw JSON node:\n" + node.toPrettyString());

      if (!errors.isEmpty()) {
    System.out.println("Schema validation failed:\n" + errors);
    throw new IllegalArgumentException(errors.toString());
}

      AgentRecord r = new AgentRecord();
      r.setAgentId(node.path("agentId").asText(null));  // ✅ safe fallback

      r.setDisplayName(node.get("displayName").asText());
      r.setVersion(node.get("version").asText());
      r.setDockerImage(node.get("dockerImage").asText());
      r.setHealthEndpoint(node.get("healthEndpoint").asText());
      // store raw JSON chunks
      r.setInputSchemaJson(node.get("inputSchema").toString());
      if (node.has("resourceLimits")) r.setResourceLimitsJson(node.get("resourceLimits").toString());
      if (node.has("secrets"))        r.setSecretsJson(node.get("secrets").toString());
      if (node.has("metadata"))       r.setMetadataJson(node.get("metadata").toString());
      return repo.save(r);
    } catch (RuntimeException ex) { throw ex; }
      catch (Exception e) { throw new IllegalArgumentException("Invalid JSON", e); }
  }
}
