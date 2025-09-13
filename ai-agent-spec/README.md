# 🤖 AI Agent Pipeline Platform

A comprehensive **drag-and-drop visual pipeline builder** for creating, managing, and executing AI agent workflows. Think "Zapier for AI Agents" - users can visually connect AI agents to create powerful automation pipelines.

## 🎯 **Platform Overview**

This platform enables users to:
- **Drag & Drop Pipeline Creation**: Visual interface for building AI workflows
- **Agent Marketplace**: Browse and use pre-built AI agents
- **Real-time Execution**: Execute pipelines with live monitoring
- **Multi-step Workflows**: Chain multiple AI agents together
- **Conditional Logic**: Add branching, loops, and approval steps
- **Cross-platform Integration**: Connect to social media, email, APIs, etc.

## 🏗️ **Architecture**

### **Microservices**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Service    │    │ Pipeline Service │    │ Catalog Service │
│   (React)       │◄──►│   (Orchestrator) │◄──►│ (Agent Registry)│
│   Port: 3000    │    │   Port: 8082     │    │   Port: 8081    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         │                        │                        │
         └────────────────────────┼────────────────────────┘
                                  │
                         ┌─────────────────┐
                         │ Runner Service  │
                         │ (Agent Executor)│
                         │   Port: 8080    │
                         └─────────────────┘
```

### **Services Description**

1. **UI Service** (React + ReactFlow)
   - Visual drag-and-drop pipeline builder
   - Agent marketplace browser
   - Real-time execution monitoring
   - Pipeline management dashboard

2. **Pipeline Service** (Spring Boot)
   - Workflow orchestration engine
   - Pipeline definition storage
   - Execution management
   - Step-by-step coordination

3. **Catalog Service** (Spring Boot + PostgreSQL)
   - AI agent registry and metadata
   - Agent discovery and validation
   - Schema management
   - Agent lifecycle management

4. **Runner Service** (Spring Boot + Docker)
   - Individual agent execution
   - Container management
   - Input/output processing
   - Resource management

## 🚀 **Quick Start**

### **Prerequisites**
- Docker & Docker Compose
- Node.js 18+ (for local development)
- Java 17+ (for local development)

### **Run the Complete Platform**
```bash
# Clone the repository
git clone <repository-url>
cd ai-agent-spec

# Start all services
docker-compose up -d

# Access the platform
open http://localhost:3000
```

### **Service URLs**
- **UI Platform**: http://localhost:3000
- **Pipeline API**: http://localhost:8082
- **Catalog API**: http://localhost:8081
- **Runner API**: http://localhost:8080
- **Database**: localhost:5432

## 🎨 **Using the Platform**

### **1. Create a Pipeline**
1. Open the platform at http://localhost:3000
2. Drag agents from the sidebar to the canvas
3. Connect agents by dragging between connection points
4. Configure each agent's settings
5. Save your pipeline

### **2. Available Components**

#### **Pipeline Components**
- 🚀 **Trigger**: Start point (manual, webhook, schedule)
- 🔀 **Condition**: Conditional branching logic
- ✋ **Approval**: Human approval steps
- ⏰ **Delay**: Wait/pause functionality

#### **AI Agents** (Examples)
- 🤖 **GPT-4 Content Generator**: Create content using OpenAI
- 🎨 **Image Generator**: Create images with DALL-E/Pollinations
- 📱 **Social Publisher**: Post to multiple platforms
- 📧 **Email Approval**: Send approval requests
- #️⃣ **Hashtag Generator**: Generate relevant hashtags

### **3. Example Use Case: Social Media Automation**

```
[Manual Trigger] 
    ↓
[GPT-4 Content Generator] → Create post content
    ↓
[Hashtag Generator] → Add relevant hashtags
    ↓
[Image Generator] → Create accompanying image
    ↓
[Email Approval] → Send for human review
    ↓
[Social Publisher] → Post to Instagram, Twitter, LinkedIn
```

## 🔧 **Development**

### **Local Development Setup**

#### **Backend Services**
```bash
# Start database
docker run -d --name postgres \
  -e POSTGRES_DB=marketplace \
  -e POSTGRES_USER=app \
  -e POSTGRES_PASSWORD=app \
  -p 5432:5432 postgres:15-alpine

# Run Catalog Service
cd catalog-service
./mvnw spring-boot:run

# Run Runner Service  
cd runner-service
./mvnw spring-boot:run

# Run Pipeline Service
cd pipeline-service
./mvnw spring-boot:run
```

#### **Frontend Development**
```bash
cd ui-service
npm install
npm start
# Opens at http://localhost:3000
```

### **Adding New Agents**

#### **1. Create Agent Definition**
```json
{
  "agentId": "my-custom-agent",
  "displayName": "My Custom Agent",
  "version": "1.0.0",
  "dockerImage": "registry.local/agents/my-agent:1.0.0",
  "inputSchema": {
    "type": "object",
    "properties": {
      "input": {"type": "string"}
    },
    "required": ["input"]
  },
  "healthEndpoint": "/health",
  "metadata": {
    "tags": ["custom", "demo"],
    "description": "My custom AI agent",
    "author": "Developer Name"
  }
}
```

#### **2. Register Agent**
```bash
curl -X POST http://localhost:8081/api/agents \
  -H "Content-Type: application/json" \
  -d @my-agent.json
```

#### **3. Create Docker Container**
Your agent container must:
- Expose a `/health` endpoint
- Accept POST requests to `/execute` with JSON input
- Return JSON output
- Handle errors gracefully

## 📊 **API Documentation**

### **Pipeline Service API**
```bash
# Create pipeline
POST /api/pipelines

# Execute pipeline
POST /api/pipelines/{id}/execute

# Get pipeline status
GET /api/pipelines/{id}

# List executions
GET /api/pipelines/{id}/executions
```

### **Catalog Service API**
```bash
# Register agent
POST /api/agents

# List agents
GET /api/agents

# Get agent details
GET /api/agents/{agentId}
```

### **Runner Service API**
```bash
# Execute agent
POST /runner/{agentId}

# Health check
GET /health
```

## 🔒 **Security & Configuration**

### **Environment Variables**
```bash
# Database
POSTGRES_DB=marketplace
POSTGRES_USER=app
POSTGRES_PASSWORD=app

# Service URLs
CATALOG_SERVICE_URL=http://catalog-service:8081
RUNNER_SERVICE_URL=http://runner-service:8080

# API Keys (for agents)
OPENAI_API_KEY=your-openai-key
GOOGLE_API_KEY=your-google-key
```

### **Agent Secrets Management**
Agents can securely access secrets through the platform:
```json
{
  "secrets": {
    "OPENAI_API_KEY": "vault/openai/key",
    "SOCIAL_MEDIA_TOKEN": "vault/social/token"
  }
}
```

## 🎯 **Use Cases**

### **Content Creation Pipeline**
- Generate blog posts with GPT-4
- Create accompanying images
- Generate SEO metadata
- Schedule publication

### **Social Media Automation**
- Create platform-specific content
- Generate hashtags and CTAs
- Get human approval
- Publish across platforms

### **Data Processing Pipeline**
- Extract data from APIs
- Process with AI models
- Generate reports
- Send notifications

### **Customer Support Automation**
- Analyze support tickets
- Generate responses
- Route to appropriate teams
- Track resolution

## 🛠️ **Technology Stack**

### **Frontend**
- React 18 + ReactFlow for visual pipeline builder
- Material-UI for components
- Axios for API communication
- React Query for state management

### **Backend**
- Spring Boot 3.5.4 (Java 17)
- PostgreSQL for data persistence
- Docker for agent containerization
- WebFlux for reactive programming

### **Infrastructure**
- Docker & Docker Compose
- Nginx for frontend serving
- H2 for development database

## 🚧 **Roadmap**

### **Phase 1: Core Platform** ✅
- [x] Visual pipeline builder
- [x] Agent registry
- [x] Basic execution engine
- [x] Docker integration

### **Phase 2: Enhanced Features** 🚧
- [ ] Real-time execution monitoring
- [ ] Pipeline templates
- [ ] Advanced conditional logic
- [ ] Webhook triggers

### **Phase 3: Enterprise Features** 📋
- [ ] User authentication & authorization
- [ ] Team collaboration
- [ ] Pipeline sharing marketplace
- [ ] Advanced analytics

### **Phase 4: AI Enhancements** 🔮
- [ ] AI-powered pipeline suggestions
- [ ] Auto-optimization
- [ ] Intelligent error handling
- [ ] Natural language pipeline creation

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for the AI automation community**