# 🔧 Technical Design - Research Automation Pipeline

## **System Architecture**

### **Service Communication Flow**
```
┌─────────────┐    HTTP/REST    ┌─────────────┐    Message Queue    ┌─────────────┐
│   Frontend  │ ──────────────→ │   Gateway   │ ──────────────────→ │   Services  │
│   (React)   │                 │  (Spring)   │                     │  (Spring)   │
└─────────────┘                 └─────────────┘                     └─────────────┘
                                        │                                    │
                                        ▼                                    ▼
                                ┌─────────────┐                     ┌─────────────┐
                                │  Database   │                     │   Agents    │
                                │(PostgreSQL) │                     │  (Docker)   │
                                └─────────────┘                     └─────────────┘
```

### **Agent Container Architecture**
```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Container                         │
├─────────────────────────────────────────────────────────────┤
│  Python Runtime Environment                                 │
│  ├─ Flask/FastAPI Web Server                               │
│  ├─ Agent Logic (Beautiful Soup, Hugging Face, etc.)      │
│  ├─ Health Check Endpoint                                  │
│  └─ Input/Output Schema Validation                         │
├─────────────────────────────────────────────────────────────┤
│  Mounted Volumes                                           │
│  ├─ /tmp/data (temporary data storage)                     │
│  ├─ /secrets (API credentials)                             │
│  └─ /config (agent configuration)                          │
└─────────────────────────────────────────────────────────────┘
```

## **Database Schema**

### **Core Tables**
```sql
-- Agent Registry
CREATE TABLE agents (
    id UUID PRIMARY KEY,
    agent_id VARCHAR(255) UNIQUE NOT NULL,
    version VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    docker_image VARCHAR(500) NOT NULL,
    input_schema JSONB NOT NULL,
    output_schema JSONB NOT NULL,
    health_endpoint VARCHAR(255),
    resources JSONB,
    environment JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Pipeline Definitions
CREATE TABLE pipelines (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    steps JSONB NOT NULL,
    connections JSONB NOT NULL,
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Pipeline Executions
CREATE TABLE pipeline_executions (
    id UUID PRIMARY KEY,
    pipeline_id UUID REFERENCES pipelines(id),
    status VARCHAR(50) NOT NULL, -- PENDING, RUNNING, COMPLETED, FAILED
    input_data JSONB,
    output_data JSONB,
    execution_log JSONB,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Agent Executions
CREATE TABLE agent_executions (
    id UUID PRIMARY KEY,
    pipeline_execution_id UUID REFERENCES pipeline_executions(id),
    agent_id VARCHAR(255) NOT NULL,
    step_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    input_data JSONB,
    output_data JSONB,
    error_message TEXT,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## **API Specifications**

### **Pipeline Service APIs**

#### **Create Pipeline Execution**
```http
POST /api/v1/pipelines/{pipelineId}/execute
Content-Type: application/json

{
  "inputParameters": {
    "researchTopic": "Electric Vehicle Market Trends",
    "emailRecipients": ["demo@company.com"],
    "maxArticles": 50
  }
}

Response:
{
  "executionId": "uuid",
  "status": "PENDING",
  "estimatedDuration": "5-10 minutes",
  "createdAt": "2024-01-15T10:00:00Z"
}
```

#### **Get Execution Status**
```http
GET /api/v1/executions/{executionId}

Response:
{
  "executionId": "uuid",
  "status": "RUNNING",
  "progress": {
    "currentStep": "data-analyzer",
    "completedSteps": ["web-scraper"],
    "totalSteps": 5,
    "percentage": 40
  },
  "steps": [
    {
      "stepId": "scraper",
      "agentId": "web-scraper-agent",
      "status": "COMPLETED",
      "startedAt": "2024-01-15T10:00:00Z",
      "completedAt": "2024-01-15T10:02:30Z",
      "output": {
        "totalScraped": 45,
        "articles": [...]
      }
    }
  ]
}
```

### **Agent Service APIs**

#### **Execute Agent**
```http
POST /api/v1/agents/{agentId}/execute
Content-Type: application/json

{
  "input": {
    "urls": ["https://techcrunch.com/ai/"],
    "maxPages": 20,
    "rateLimit": 2.0
  },
  "executionId": "uuid",
  "stepId": "scraper"
}

Response:
{
  "executionId": "uuid",
  "status": "RUNNING",
  "estimatedDuration": "2-3 minutes"
}
```

## **Agent Implementation Details**

### **Web Scraper Agent**
```python
# Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8080
CMD ["python", "app.py"]

# requirements.txt
flask==2.3.3
beautifulsoup4==4.12.2
scrapy==2.11.0
requests==2.31.0
lxml==4.9.3

# app.py
from flask import Flask, request, jsonify
import asyncio
from scraper import WebScraper

app = Flask(__name__)

@app.route('/health')
def health():
    return {'status': 'healthy'}

@app.route('/execute', methods=['POST'])
def execute():
    data = request.json
    scraper = WebScraper()
    result = scraper.scrape(
        urls=data['urls'],
        selectors=data.get('selectors', {}),
        max_pages=data.get('maxPages', 50),
        rate_limit=data.get('rateLimit', 1.0)
    )
    return jsonify(result)
```

### **Data Analyzer Agent**
```python
# requirements.txt
flask==2.3.3
transformers==4.35.0
torch==2.1.0
pandas==2.1.3
numpy==1.24.3
scikit-learn==1.3.2

# analyzer.py
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
import pandas as pd
import numpy as np

class DataAnalyzer:
    def __init__(self):
        self.sentiment_analyzer = pipeline("sentiment-analysis")
        self.summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
    
    def analyze(self, articles, analysis_type="all"):
        results = {
            "insights": {},
            "statistics": {}
        }
        
        if analysis_type in ["sentiment", "all"]:
            results["insights"]["sentiment"] = self._analyze_sentiment(articles)
        
        if analysis_type in ["topics", "all"]:
            results["insights"]["topics"] = self._extract_topics(articles)
        
        if analysis_type in ["summary", "all"]:
            results["insights"]["summary"] = self._generate_summary(articles)
        
        results["statistics"] = self._calculate_statistics(articles)
        return results
```

### **Report Generator Agent**
```python
# requirements.txt
flask==2.3.3
jinja2==3.1.2
weasyprint==60.1
matplotlib==3.8.2
plotly==5.17.0
pandas==2.1.3

# report_generator.py
from jinja2 import Template
import weasyprint
import matplotlib.pyplot as plt
import plotly.graph_objects as go
import json

class ReportGenerator:
    def __init__(self):
        self.templates = {
            "research": self._load_template("research_template.html"),
            "market-analysis": self._load_template("market_template.html")
        }
    
    def generate_report(self, insights, title, template="research", include_charts=True):
        # Generate charts
        charts = []
        if include_charts:
            charts = self._generate_charts(insights)
        
        # Render HTML
        html_content = self.templates[template].render(
            title=title,
            insights=insights,
            charts=charts,
            generated_at=datetime.now().isoformat()
        )
        
        # Convert to PDF
        pdf_path = f"/tmp/reports/{title.replace(' ', '_')}.pdf"
        weasyprint.HTML(string=html_content).write_pdf(pdf_path)
        
        return {
            "reportPath": pdf_path,
            "reportUrl": f"/reports/{os.path.basename(pdf_path)}",
            "charts": charts,
            "metadata": {
                "pages": self._count_pages(pdf_path),
                "size": f"{os.path.getsize(pdf_path) / 1024:.1f} KB"
            }
        }
```

## **Deployment Configuration**

### **Docker Compose (Development)**
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: marketplace
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  catalog-service:
    build: ./catalog-service
    ports:
      - "8081:8080"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/marketplace
      - SPRING_DATASOURCE_USERNAME=app
      - SPRING_DATASOURCE_PASSWORD=app
    depends_on:
      - postgres

  pipeline-service:
    build: ./pipeline-service
    ports:
      - "8082:8080"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/marketplace
    depends_on:
      - postgres

  runner-service:
    build: ./runner-service
    ports:
      - "8083:8080"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - DOCKER_HOST=unix:///var/run/docker.sock

  ui-service:
    build: ./ui-service
    ports:
      - "3000:80"
    environment:
      - REACT_APP_API_BASE_URL=http://localhost:8081

volumes:
  postgres_data:
```

### **Kubernetes Deployment (Production)**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: catalog-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: catalog-service
  template:
    metadata:
      labels:
        app: catalog-service
    spec:
      containers:
      - name: catalog-service
        image: marketplace/catalog-service:1.0.0
        ports:
        - containerPort: 8080
        env:
        - name: SPRING_DATASOURCE_URL
          value: "jdbc:postgresql://postgres:5432/marketplace"
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
```

## **Monitoring & Observability**

### **Health Checks**
```java
@RestController
@RequestMapping("/actuator")
public class HealthController {
    
    @Autowired
    private DatabaseHealthIndicator databaseHealth;
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("timestamp", Instant.now());
        health.put("database", databaseHealth.isHealthy());
        health.put("version", "1.0.0");
        return ResponseEntity.ok(health);
    }
}
```

### **Metrics Collection**
```java
@Component
public class PipelineMetrics {
    
    private final MeterRegistry meterRegistry;
    private final Counter executionCounter;
    private final Timer executionTimer;
    
    public PipelineMetrics(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
        this.executionCounter = Counter.builder("pipeline.executions")
            .description("Total pipeline executions")
            .register(meterRegistry);
        this.executionTimer = Timer.builder("pipeline.execution.duration")
            .description("Pipeline execution duration")
            .register(meterRegistry);
    }
    
    public void recordExecution(String pipelineId, Duration duration, String status) {
        executionCounter.increment(
            Tags.of("pipeline", pipelineId, "status", status)
        );
        executionTimer.record(duration);
    }
}
```

This technical design provides the foundation for implementing a scalable, production-ready AI Agent Marketplace with the research automation pipeline as our flagship demo use case.