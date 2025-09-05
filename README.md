
## Middle Layer Backend - Student Support Portal

This Node.js/Express service acts as the middle layer backend for ENY Consulting's Business Analysis School, handling general endpoints (auth, users, leads, escalations, chat history), proxying AI requests to the Core Backend, and managing data storage in MongoDB. It supports real-time chat via Socket.io and caches responses in Redis.

---

## Overview

The Middle Backend:

* Proxies user queries to AI Core Backend.
* Stores chat history, leads, and escalations in MongoDB.
* Manages real-time chat with Socket.io.
* Supports optional admin dashboard for viewing data.

This service ensures seamless integration between the frontend and AI backend while handling persistence and operational logic.

---

## ⚙️ Tech Stack

* **Framework**: Node.js + Express (TypeScript)
* **Database**: MongoDB + Mongoose
* **Caching**: Redis (via ioredis)
* **Other Tools**: Socket.io Server, JWT (Authentication)
* **Deployment**: Render

---

**Role in Flow**:
1. Receives user queries from Frontend.
2. Proxies AI requests to Core Backend.
3. Stores chat history, escalations, and leads in MongoDB.
4. Forwards responses to Frontend via HTTP/Socket.io.

---

## Codebase Structure

```
/
├── src/
│   ├── controllers/       # API logic (leads, escalations, chat history)
│   ├── models/            # Mongoose schemas
│   ├── middlewares/       # Auth, error handling
│   ├── utils/             # JWT, Redis helpers
│   ├── config/            # DB, env
│   └── index.ts           # Entry point
├── Dockerfile             # For deployment
└── README.md
```

---

## System Architecture

```
┌─────────────────────┐
│   Frontend (Web)    │
│  - BA School Portal │
│  - Student Support  │
└─────────▲───────────┘
          │  HTTP/WS
          │
          ▼
┌─────────────────────────────┐
│    Middle Backend (Node.js) │
│─────────────────────────────│
│  - Express API              │
│  - Socket.IO (Real-time)    │
│  - Redis Cache              │
│  - MongoDB Integration      │
│  - AI Proxy Layer            │
└───────────┬─────────────────┘
            │
            │ REST / WebSocket
            │
            ▼
┌─────────────────────────────┐
│       Core Backend (AI)     │
│─────────────────────────────│
│  - FastAPI (Python)         │
│  - RAG Engine (Context)     │
│  - DeepSeek LLM Integration │
│  - Load Balancing & Fallback│
└───────────┬─────────────────┘
            │
            │
            ▼
┌─────────────────────┐
│    DeepSeek API     │
│  - Chat v3.1        │
│  - Free/Paid Tier   │
└─────────────────────┘


Additional Services:
┌─────────────────────┐     ┌─────────────────────┐
│      MongoDB        │     │       Redis         │
│  - Leads            │     │  - AI Response Cache│
│  - Escalations      │     │  - Session Storage  │
│  - Chat History     │     └─────────────────────┘
└─────────────────────┘
```

## Getting Started

### Prerequisites

* Node.js (v18+)
* MongoDB (local or Atlas)
* Redis (local or hosted)
* GitHub account

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/middle-backend.git
cd middle-backend
```

### 2. Install Dependencies

```bash
npm install express typescript @types/express @types/node mongoose socket.io ioredis jsonwebtoken @types/jsonwebtoken zod
npm install -D ts-node-dev jest @types/jest supertest @types/supertest
```

### 3. Setup Environment

Create `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student-portal
JWT_SECRET=your_super_secret_key
AI_BACKEND_URL=http://localhost:8000/api
REDIS_URL=redis://localhost:6379
```

### 4. Run Server

```bash
npm run dev
```

Access API at http://localhost:5000/api.

---

## Database Models (MongoDB)

* **Lead**:
  ```typescript
  {
    email: String,
    query: String,
    createdAt: Date
  }
  ```
* **Escalation**:
  ```typescript
  {
    query: String,
    userEmail: String,
    createdAt: Date
  }
  ```
* **ChatHistory**:
  ```typescript
  {
    userId: String, // From JWT or email
    messages: [{
      query: String,
      response: String,
      confidence: Number,
      timestamp: Date
    }],
    createdAt: Date
  }
  ```

---

## API Endpoints

Base URL: `/api`

| Method | Endpoint          | Description                     | Access       |
|--------|-------------------|---------------------------------|--------------|
| POST   | /chat             | Proxy to AI Core /chat          | Public/Auth  |
| POST   | /escalate         | Handle escalation               | Public/Auth  |
| POST   | /leads            | Capture lead info               | Public/Auth  |
| POST   | /chat-history     | Store user chat history         | Auth         |
| GET    | /chat-history     | Retrieve user chat history      | Auth         |
| GET    | /admin/escalations| View escalated queries          | Admin        |

**Chat History Endpoints**:
- **POST /api/chat-history**:
  - Body: `{ userId: string, query: string, response: string, confidence: number }`
  - Stores message in MongoDB under user’s chat history.
  - Requires JWT.
- **GET /api/chat-history**:
  - Query: `?userId=string`
  - Returns user’s chat messages.
  - Secured with JWT.

*Socket.io Events*: 'message' for real-time responses.

---

## Access Matrix

| Role/User Type | Chat with AI | Escalate Query | View Leads/Escalations | Manage Chat History |
|----------------|--------------|----------------|------------------------|---------------------|
| Guest          | ✅            | ✅ (with email)| ❌                     | ❌                  |
| Authenticated  | ✅            | ✅             | ❌                     | ✅                  |
| Admin          | ✅            | ✅             | ✅                     | ✅                  |

---

## Security

* **Authentication**: JWT (Bearer tokens); required for chat history/admin routes.
* **Validation**: Zod for input sanitization.
* **Security**: CORS, rate limiting; env var secrets.
* **Data Privacy**: GDPR-compliant; anonymized data.

---

## Testing

* Jest + Supertest for API tests (including chat history).

```bash
npm test
```

---

## Deployment

* Deploy to Render with Node.js setup.
* Set env vars in dashboard.
* Use MongoDB Atlas for database.

URL: https://middle-backend.onrender.com/api

---
## Author

Built by BLARD OMU for ENY Consulting Technical Assessment.
