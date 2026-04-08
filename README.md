# Kikki - AI Coding Assistant

Kikki is an AI-powered coding assistant that helps developers with day-to-day coding tasks, debugging, and learning.

## Project Structure

```
Kikki/
├── frontend/          # React + TypeScript frontend
├── src/               # Spring Boot backend
├── docker-compose.yml # PostgreSQL with pgvector
└── pom.xml            # Maven configuration
```

## Tech Stack

### Backend
- **Framework:** Spring Boot 4.0.3
- **Language:** Java 21
- **AI:** Spring AI with OpenAI (GPT-4.1)
- **Database:** PostgreSQL 17 with pgvector
- **Security:** Spring Security + JWT

### Frontend
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **Features:** Voice input (Web Speech API), Chat interface

## Getting Started

### Prerequisites
- Java 21
- Node.js 18+
- Docker & Docker Compose

### 1. Start the Database

```bash
docker-compose up -d
```

This starts PostgreSQL with pgvector on port 6010.

### 2. Start the Backend

```bash
# From the root directory
./mvnw spring-boot:run
```

The backend will run on `http://localhost:6000`

**Note:** Make sure to configure your OpenAI API key in `src/main/resources/application.yaml`:

```yaml
spring:
  ai:
    openai:
      api-key: your-api-key-here
```

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

## Features

### Authentication
- **Sign Up:** Create a new account
- **Login:** JWT-based authentication
- **Auto-refresh:** Token refresh on expiration

### AI Chat
- **Text Input:** Type your coding questions
- **Voice Input:** Click the microphone button to speak your question
- **Conversation Memory:** Remembers context across messages
- **Structured Responses:** Clear, formatted answers

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/signup` | User registration | No |
| POST | `/api/v1/auth/login` | Login | No |
| POST | `/api/v1/auth/refresh` | Refresh token | No (uses cookie) |
| POST | `/api/v1/askAI` | Ask AI question | Yes (Bearer token) |

## Browser Support

Voice input requires Web Speech API support:
- Chrome/Edge: Full support
- Safari: Full support
- Firefox: Not supported (use text input)

## Troubleshooting

### CORS Errors
Make sure the backend CORS configuration allows `http://localhost:5173`.

### Database Connection Failed
Ensure Docker container is running:
```bash
docker ps | grep kikki
```

### Voice Input Not Working
- Check browser permissions for microphone access
- Use Chrome/Edge for best support
