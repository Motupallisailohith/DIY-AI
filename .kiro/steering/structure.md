# Project Structure

## Root Directory
```
├── .github/           # GitHub workflows and templates
├── .kiro/            # Kiro AI assistant configuration
├── catalog-service/  # Main Spring Boot application
├── examples/         # Agent definition examples
├── schema/           # JSON Schema definitions
└── vendor-meta/      # Vendor-specific metadata
```

## Catalog Service Structure
```
catalog-service/
├── src/
│   ├── main/
│   │   ├── java/com/marketplace/catalog_service/  # Java source code
│   │   └── resources/                             # Configuration files
│   └── test/                                      # Test files
├── target/           # Maven build output
├── pom.xml          # Maven configuration
├── Dockerfile       # Container build instructions
└── docker-compose.dev.yml  # Development environment
```

## Key Files & Conventions

### Agent Definitions
- **Location**: `examples/` directory
- **Format**: JSON files following the agent schema
- **Naming**: Use kebab-case (e.g., `hello-world.json`, `openai-gpt4.json`)
- **Schema**: Must conform to `schema/agent-schema.json`

### Required Agent Properties
- `agentId`: Lowercase letters, numbers, hyphens only
- `version`: Semantic versioning (e.g., "1.0.0")
- `dockerImage`: Full OCI image reference
- `inputSchema`: JSON Schema for execution payload
- `healthEndpoint`: Health check endpoint path

### Java Package Structure
- Base package: `com.marketplace.catalog_service`
- Follow Spring Boot conventions:
  - Controllers in `controller` package
  - Services in `service` package
  - Repositories in `repository` package
  - Entities in `entity` package
  - DTOs in `dto` package

### Configuration Files
- Application properties in `src/main/resources/application.yml`
- Database migrations in `src/main/resources/db/migration/`
- Use Flyway naming convention: `V{version}__{description}.sql`

## Development Workflow
1. Agent definitions go in `examples/` for reference
2. Schema changes require updating `schema/agent-schema.json`
3. Database changes use Flyway migrations
4. All services should expose health endpoints for monitoring