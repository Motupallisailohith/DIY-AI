package com.marketplace.catalog_service.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.networknt.schema.JsonSchema;
import com.networknt.schema.JsonSchemaFactory;
import com.networknt.schema.SpecVersion;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.InputStream;

@Configuration
public class SchemaConfig {
  @Bean
  public JsonSchema agentJsonSchema(ObjectMapper mapper) throws Exception {
    JsonSchemaFactory factory = JsonSchemaFactory.getInstance(SpecVersion.VersionFlag.V7);
    try (InputStream is = getClass().getResourceAsStream("/schema/agent-schema.json")) {
      JsonNode node = mapper.readTree(is);
      return factory.getSchema(node);
    }
  }
}
