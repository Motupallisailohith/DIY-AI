package com.marketplace.catalog_service.repo;

import com.marketplace.catalog_service.model.AgentRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface AgentRepository extends JpaRepository<AgentRecord, UUID> {
  Optional<AgentRecord> findByAgentIdAndVersion(String agentId, String version);
}
