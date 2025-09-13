CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY,
  agent_id varchar(255) NOT NULL,
  display_name varchar(255) NOT NULL,
  version varchar(255) NOT NULL,
  docker_image varchar(500) NOT NULL,
  health_endpoint varchar(255) NOT NULL,
  input_schema_json clob NOT NULL,
  resource_limits_json clob,
  secrets_json clob,
  metadata_json clob,
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  UNIQUE (agent_id, version)
);
