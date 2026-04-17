# Kikki - AI Coding Assistant

<p align="center">
  <img src="frontend/src/assets/react.svg" alt="Kikki Logo" width="100" height="100">
</p>

<p align="center">
  An intelligent AI-powered coding assistant that helps developers with day-to-day coding tasks, debugging, and learning.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#api-documentation">API</a> •
  <a href="#project-structure">Structure</a>
</p>

---

## Features

### AI Chat Interface
- **Text Input**: Type your coding questions naturally
- **Voice Input**: Click the microphone button to speak your questions (Web Speech API)
- **Conversation Memory**: Context-aware responses that remember previous messages
- **Structured Responses**: Clear, formatted answers with code highlighting

### Authentication & Security
- **JWT-Based Auth**: Secure token-based authentication with automatic refresh
- **User Registration**: Sign up with email and password
- **Protected Routes**: Secure access to AI chat features

### Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark/Light Theme**: Toggle between themes for comfortable coding
- **Real-time Feedback**: Loading states and error handling

---

## Tech Stack

### Backend (Spring Boot)
| Technology | Purpose |
|------------|---------|
| **Spring Boot 4.0.3** | Application framework |
| **Java 21** | Programming language |
| **Spring AI** | OpenAI integration (GPT-4.1) |
| **Spring Security + JWT** | Authentication & authorization |
| **PostgreSQL 17 + pgvector** | Database with vector search |
| **Spring Data JPA** | Data persistence |
| **OpenAPI/Swagger** | API documentation |

### Frontend (React)
| Technology | Purpose |
|------------|---------|
| **React 19** | UI library |
| **TypeScript** | Type-safe development |
| **Vite** | Build tool & dev server |
| **TailwindCSS 4** | Utility-first styling |
| **React Router v7** | Client-side routing |
| **Axios** | HTTP client |

---

## Quick Start

### Prerequisites
- **Java 21** or higher
- **Node.js 18** or higher
- **Docker** & **Docker Compose**
- **OpenAI API Key** - [Get one here](https://platform.openai.com/api-keys)

### 1. Clone & Configure

```bash
# Clone the repository
git clone <repository-url>
cd Kikki

# Configure OpenAI API key
# Edit src/main/resources/application.yaml and add your API key:
```

```yaml
spring:
  ai:
    openai:
      api-key: your-openai-api-key-here
```

### 2. Start Infrastructure

```bash
# Start PostgreSQL with pgvector
docker-compose up -d

# Verify container is running
docker ps | grep kikki
```

### 3. Start Backend

```bash
# Using Maven wrapper (Linux/Mac)
./mvnw spring-boot:run

# Or on Windows
mvnw.cmd spring-boot:run

# Or using installed Maven
mvn spring-boot:run
```

The backend will be available at `http://localhost:8064`

### 4. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

---

## API Documentation

Once the backend is running, access the interactive API documentation at:

```
http://localhost:8064/api/v1/swagger-ui.html
```

### Endpoints Overview

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/v1/auth/signup` | Register new user | No |
| `POST` | `/api/v1/auth/login` | Authenticate user | No |
| `POST` | `/api/v1/auth/refresh` | Refresh access token | No (uses cookie) |
| `POST` | `/api/v1/askAI` | Send message to AI | Yes (Bearer) |

### Authentication Flow

```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 86400,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

Use the token in subsequent requests:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## Project Structure

```
Kikki/
├── src/main/java/com/project/kikki/
│   ├── AI/
│   │   ├── config/          # AI configuration (OpenAI setup)
│   │   ├── controller/      # AI REST endpoints
│   │   ├── service/         # Business logic & AI interactions
│   │   ├── entity/          # Token usage tracking
│   │   ├── repository/      # Data access layer
│   │   └── utils/           # Prompt templates
│   ├── security/
│   │   ├── config/          # Security & JWT configuration
│   │   ├── controller/        # Auth endpoints
│   │   ├── service/         # Auth & user services
│   │   ├── entity/          # User & JWT entities
│   │   ├── dto/             # Data transfer objects
│   │   ├── repository/      # User repository
│   │   └── exception/       # Custom exceptions
│   └── exceptionHandler/    # Global exception handling
├── src/main/resources/
│   └── application.yaml     # Application configuration
├── frontend/src/
│   ├── pages/               # Page components (Login, Signup, Chat)
│   ├── components/          # Reusable UI components
│   │   ├── chat/           # Chat-specific components
│   │   └── layout/         # Layout components
│   ├── context/            # React contexts (Auth, Theme)
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API service functions
│   └── assets/             # Static assets
├── docker-compose.yml       # PostgreSQL configuration
└── pom.xml                  # Maven dependencies
```

---

## Configuration Reference

### Application Properties

| Property | Description | Default |
|----------|-------------|---------|
| `server.port` | Backend port | `8064` |
| `server.servlet.context-path` | API base path | `/api/v1` |
| `spring.datasource.url` | Database URL | `jdbc:postgresql://localhost:6010/kikki` |
| `spring.ai.openai.model` | OpenAI model | `gpt-4.1-2025-04-14` |
| `spring.ai.openai.temperature` | Response creativity | `0.7` |

### Environment Variables

You can externalize configuration using environment variables:

```bash
export OPENAI_API_KEY=your-key-here
export JWT_SECRET_KEY=your-jwt-secret
export DB_PASSWORD=your-db-password
```

---

## Development

### Backend Development

```bash
# Run tests
./mvnw test

# Build JAR
./mvnw clean package

# Run JAR
java -jar target/Kikki-0.0.1-SNAPSHOT.jar
```

### Frontend Development

```bash
cd frontend

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---/v

## Browser Support

| Feature | Chrome/Edge | Safari | Firefox |
|---------|-------------|--------|---------|
| Text Chat | ✅ | ✅ | ✅ |
| Voice Input | ✅ | ✅ | ❌ |
| Dark Theme | ✅ | ✅ | ✅ |

*Voice input requires Web Speech API support. Firefox users can use text input.*

---

## Troubleshooting

### Database Connection Issues
```bash
# Check if container is running
docker ps | grep kikki

# View logs
docker logs kikki-local-Image

# Restart container
docker-compose restart
```

### CORS Errors
Ensure the backend allows requests from `http://localhost:5173`. This is configured in `WebSecurityConfig.java`.

### OpenAI API Errors
- Verify your API key is set correctly in `application.yaml`
- Check that you have available API credits
- Review backend logs for detailed error messages

### Voice Input Not Working
- Check browser microphone permissions
- Use Chrome or Edge for best compatibility
- Ensure HTTPS or localhost (required by Web Speech API)

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

<p align="center">
  Built with ❤️ using Spring Boot and React
</p>
