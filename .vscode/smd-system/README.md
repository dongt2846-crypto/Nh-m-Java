# SMD - Syllabus Management and Digitalization System

## 🎯 Overview
Hệ thống Quản lý và Số hóa Giáo trình (SMD) là một nền tảng web và mobile toàn diện để quản lý giáo trình học thuật với các tính năng AI tiên tiến bao gồm phát hiện thay đổi, tóm tắt nội dung và phân tích CLO-PLO.

## 🏗️ System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend Web  │    │  Mobile App     │    │   Admin Panel   │
│   (NextJS)      │    │ (React Native)  │    │   (NextJS)      │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │     Backend Core API      │
                    │   (Java Spring Boot)      │
                    │        MySQL DB           │
                    └─────────────┬─────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │   AI Microservice         │
                    │   (Python FastAPI)        │
                    │ PostgreSQL + Elasticsearch│
                    │   Celery + Redis          │
                    └───────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Docker Desktop
- Git
- 8GB+ RAM (recommended for AI services)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd smd-system

# Windows users
setup.bat

# Linux/Mac users
chmod +x setup.sh
./setup.sh
```

### Access Points
- **Web Application**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **AI Service**: http://localhost:8000
- **Elasticsearch**: http://localhost:9200

### Default Login
- **Username**: admin
- **Password**: admin123

## 👥 User Roles & Complete Functionality

### 🔧 System Admin
- **User Management**: Create, edit, delete users; bulk import; role assignment
- **System Configuration**: Academic year, semester settings, workflow rules
- **Publishing Management**: Final approval and publication control
- **Audit Logs**: Complete system activity tracking
- **Workflow Configuration**: Customize approval processes

### 👨‍🏫 Lecturer
- **Syllabus Creation**: Complete syllabus authoring with metadata
- **Version Management**: Track changes and maintain version history
- **Collaborative Review**: Participate in peer review processes
- **Submission Workflow**: Submit for HoD review
- **Notification System**: Real-time updates on syllabus status

### 👔 Head of Department (HoD)
- **Level 1 Approval**: Review and approve department syllabi
- **AI Change Detection**: Automated change analysis between versions
- **Collaborative Review Management**: Coordinate peer reviews
- **CLO-PLO Verification**: Ensure learning outcome alignment
- **Department Analytics**: Track department syllabus progress

### 🏛️ Academic Affairs
- **Level 2 Approval**: Institution-wide syllabus approval
- **PLO Management**: Define and maintain Program Learning Outcomes
- **Program Structure**: Manage curriculum frameworks
- **Compliance Reports**: CLO-PLO alignment analysis
- **Cross-department Analytics**: Institution-wide insights

### 🎓 Principal
- **Strategic Oversight**: Executive dashboard and KPIs
- **Final Approval**: Ultimate syllabus publication authority
- **Impact Analysis**: System-wide performance metrics
- **Policy Decisions**: High-level academic policy approval

### 👨‍🎓 Student/Public
- **Advanced Search**: Multi-criteria syllabus discovery
- **AI Summaries**: Automated content summarization
- **Subject Tree**: Prerequisite relationship visualization
- **Subscription System**: Real-time syllabus update notifications
- **Mobile Access**: Full mobile app experience

## 🤖 AI Features (Vietnamese NLP Optimized)

### 1. Semantic Difference Detection
- **Vietnamese Text Analysis**: Using PhoBERT/ViBERT models
- **Change Tracking**: Identifies meaningful content modifications
- **Similarity Scoring**: Quantifies changes between versions
- **API**: `POST /api/ai/semantic-diff`

### 2. Intelligent Summarization
- **Multi-language Support**: Vietnamese and English content
- **Student-friendly Summaries**: Tailored for different audiences
- **Key Point Extraction**: Automatic highlight generation
- **API**: `POST /api/ai/summary/{syllabusId}`

### 3. CLO-PLO Compliance Analysis
- **Automated Mapping**: AI-powered outcome alignment
- **Compliance Scoring**: Quantitative assessment
- **Gap Analysis**: Identifies missing alignments
- **API**: `POST /api/ai/clo-plo-check/{syllabusId}`

### 4. Course Relationship Mining
- **Prerequisite Detection**: Automatic relationship extraction
- **Curriculum Mapping**: Visual course progression
- **Dependency Analysis**: Complex relationship modeling
- **API**: `POST /api/ai/relation-extract`

### 5. Vietnamese OCR & Document Processing
- **VietOCR Integration**: Optimized for Vietnamese text
- **Multi-format Support**: PDF, Word, Image processing
- **Text Extraction**: Legacy document digitization
- **API**: `POST /api/ai/ocr`

## 🔄 Complete Workflow Process
```
Draft → Collaborative Review → HoD Review → Academic Affairs → Principal → Published
  ↑              ↓                ↓              ↓              ↓
  └──────── Rejected ←────────────┴──────────────┴──────────────┘
```

### Workflow Features
- **Multi-level Approval**: Configurable approval chains
- **Parallel Reviews**: Collaborative peer review system
- **Version Control**: Complete change tracking
- **Notification System**: Real-time status updates
- **Audit Trail**: Complete workflow history

## 📱 Applications

### Web Applications (Role-specific)
1. **System Admin Portal**
   - User lifecycle management
   - System configuration
   - Workflow customization
   - Audit log analysis

2. **Lecturer Workspace**
   - Syllabus authoring tools
   - Version management
   - Collaborative features
   - Progress tracking

3. **HoD Dashboard**
   - Review queue management
   - AI-assisted analysis
   - Department oversight
   - Approval workflows

4. **Academic Affairs Console**
   - Institution-wide management
   - PLO administration
   - Compliance monitoring
   - Strategic reporting

5. **Principal Executive View**
   - Strategic dashboard
   - KPI monitoring
   - Policy management
   - Final approvals

6. **Student Portal**
   - Course discovery
   - AI-powered insights
   - Mobile-optimized interface
   - Subscription management

### Mobile Application (React Native)
- **Cross-platform**: iOS and Android support
- **Offline Capability**: Download for offline reading
- **Push Notifications**: Real-time updates
- **Optimized Search**: Mobile-first discovery
- **Responsive Design**: Adaptive UI/UX

## 🛠️ Technology Stack

### Backend (Enterprise-grade)
- **Framework**: Java Spring Boot 3.2
- **Database**: MySQL 8.0 (Primary), PostgreSQL (AI)
- **Cache**: Redis 7.0
- **Security**: JWT + Spring Security + RBAC
- **API**: RESTful with OpenAPI documentation

### Frontend (Modern Stack)
- **Web**: NextJS 14 + TypeScript
- **Mobile**: React Native + Expo
- **Styling**: Tailwind CSS + Custom Components
- **State Management**: React Query + Context API

### AI & NLP (Vietnamese-optimized)
- **Framework**: Python FastAPI + Celery
- **Vietnamese Models**: PhoBERT, ViBERT, VnCoreNLP
- **ML Pipeline**: Transformers, SentenceTransformers
- **Vector DB**: PostgreSQL + pgvector
- **Search**: Elasticsearch 8.0
- **OCR**: VietOCR + Tesseract

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Message Queue**: Redis + Celery
- **Monitoring**: Built-in health checks
- **Logging**: Structured logging with ELK stack ready

## 📊 Database Schema (Complete)

### Core Entities
- **Users & Roles**: RBAC implementation
- **Syllabi & Versions**: Complete version control
- **CLOs & PLOs**: Learning outcome management
- **Workflow States**: Approval process tracking
- **Notifications**: Real-time communication
- **Collaborative Reviews**: Peer review system
- **Subscriptions**: User preference management

### AI Data Models
- **Vector Embeddings**: Semantic search capability
- **Change Detection**: Diff analysis storage
- **Relationship Graphs**: Course dependency mapping

## 🔧 Development & Deployment

### Local Development
```bash
# Backend
cd backend/smd-backend
mvn spring-boot:run

# Frontend
cd frontend/smd-web
npm run dev

# AI Service
cd ai-service/smd-ai-service
uvicorn app.main:app --reload

# Mobile
cd mobile/smd-mobile
expo start
```

### Production Deployment
- **Environment Configuration**: Multi-environment support
- **SSL/TLS**: HTTPS enforcement
- **Database Backup**: Automated backup strategies
- **Monitoring**: Health checks and metrics
- **Scaling**: Horizontal scaling ready

## 🧪 Testing & Quality Assurance

### Testing Strategy
- **Unit Tests**: Backend service testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Complete workflow testing
- **Performance Tests**: Load and stress testing
- **Security Tests**: Vulnerability assessment

### Quality Metrics
- **Code Coverage**: >80% target
- **Performance**: <2s response time
- **Availability**: 99.9% uptime target
- **Security**: OWASP compliance

## 🔒 Security & Compliance

### Security Features
- **Authentication**: JWT-based with refresh tokens
- **Authorization**: Role-based access control (RBAC)
- **Data Protection**: Encryption at rest and in transit
- **Input Validation**: Comprehensive sanitization
- **Audit Logging**: Complete activity tracking

### Compliance
- **Data Privacy**: GDPR-ready architecture
- **Academic Standards**: ABET compliance support
- **Security Standards**: OWASP best practices
- **Accessibility**: WCAG 2.1 AA compliance

## 📈 Performance & Scalability

### Performance Targets
- **Response Time**: <2s for 95% of requests
- **Concurrent Users**: 100+ simultaneous users
- **AI Processing**: Background processing for heavy tasks
- **Database**: Optimized queries with indexing

### Scalability Features
- **Microservices**: Independent service scaling
- **Caching**: Multi-level caching strategy
- **Load Balancing**: Ready for horizontal scaling
- **Database Sharding**: Future-proof data architecture

## 📚 Documentation & Support

### Complete Documentation
- **User Requirements**: Detailed functional specs
- **SRS**: Software Requirements Specification
- **Architecture Design**: System design documents
- **API Documentation**: OpenAPI/Swagger specs
- **User Manuals**: Role-specific guides
- **Installation Guide**: Deployment instructions

### Support Resources
- **Training Materials**: User onboarding guides
- **Video Tutorials**: Step-by-step walkthroughs
- **FAQ**: Common questions and solutions
- **Technical Support**: Issue tracking system

## 🚀 Future Roadmap

### Phase 2 Enhancements
- **Advanced Analytics**: ML-powered insights
- **Integration APIs**: LMS integration capabilities
- **Mobile Enhancements**: Offline-first architecture
- **AI Improvements**: Advanced NLP features

### Scalability Improvements
- **Microservices**: Full service decomposition
- **Cloud Native**: Kubernetes deployment
- **Global CDN**: Worldwide content delivery
- **Multi-tenancy**: Institution isolation

---

**🎓 Built for Academic Excellence - Empowering Vietnamese Higher Education**

*This system represents a complete solution for modern syllabus management, combining traditional academic workflows with cutting-edge AI technology optimized for Vietnamese educational institutions.*