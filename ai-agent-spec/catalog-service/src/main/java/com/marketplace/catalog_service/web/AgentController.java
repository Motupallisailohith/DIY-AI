package com.marketplace.catalog_service.web;

import com.marketplace.catalog_service.model.AgentRecord;
import com.marketplace.catalog_service.repo.AgentRepository;
import com.marketplace.catalog_service.service.AgentSpecService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/agents")
public class AgentController {
  private final AgentSpecService service;
  private final AgentRepository repo;
  public AgentController(AgentSpecService s, AgentRepository r){ this.service=s; this.repo=r; }

  @PostMapping
  public ResponseEntity<?> create(@RequestBody String body){
    AgentRecord saved = service.register(body);
    return ResponseEntity.ok(saved);
  }

  @GetMapping
  public ResponseEntity<?> list(){ return ResponseEntity.ok(repo.findAll()); }

  @GetMapping("/{id}")
  public ResponseEntity<?> get(@PathVariable UUID id){
    return repo.findById(id).<ResponseEntity<?>>map(ResponseEntity::ok)
              .orElse(ResponseEntity.notFound().build());
  }
}
