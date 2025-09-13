# Technology Stack

## Backend
- **Java 17** - Primary programming language
- **Spring Boot 3.5.4** - Application framework
- **Spring Data JPA** - Data persistence layer
- **Spring Web** - REST API framework
- **Spring Boot Actuator** - Health checks and monitoring
- **Hibernate** - ORM with custom types support
- **Flyway** - Database migration management
- **PostgreSQL** - Primary database
- **Lombok** - Code generation for boilerplate reduction

## Build & Deployment
- **Maven** - Build system and dependency management
- **Docker** - Containerization platform
- **Docker Compose** - Local development orchestration

## Validation & Schema
- **JSON Schema Validator** (NetworkNT) - Input validation
- **Spring Boot Validation** - Bean validation

## Common Commands

### Development
```bash
# Build the project
mvn clean compile

# Run tests
mvn test

# Package application
mvn clean package

# Run application locally
mvn spring-boot:run

# Start development environment with database
docker-compose -f catalog-service/docker-compose.dev.yml up
```

### Database
- Flyway handles migrations automatically on startup
- PostgreSQL runs on port 5432 in development
- Default credentials: app/app, database: marketplace

## Code Style
- Use Lombok annotations to reduce boilerplate
- Follow Spring Boot conventions for package structure
- Package naming: `com.marketplace.catalog_service` (note underscore, not hyphen)