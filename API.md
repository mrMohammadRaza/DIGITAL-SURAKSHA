# Digital Suraksha — REST API Specification
**Base URL:** `http://localhost:5000/api/v1`

---

## 1. Health & System Status

### `GET /health`
Returns service liveness and current timestamp.
- **Status:** `200 OK`
```json
{
  "success": true,
  "data": {
    "status": "UP",
    "timestamp": "2026-10-16T14:30:00.000Z",
    "service": "digital-suraksha-api",
    "version": "1.0.0"
  }
}
```

### `GET /ready`
Checks database connectivity and server readiness.
- **Status:** `200 OK` / `503 Service Unavailable`
```json
{
  "success": true,
  "data": {
    "status": "READY",
    "database": "CONNECTED",
    "timestamp": "2026-10-16T14:30:00.000Z"
  }
}
```

---

## 2. Educational Content Endpoints

### `GET /categories`
Lists all fraud awareness categories with topic and quiz counts.
- **Status:** `200 OK`

### `GET /topics`
Retrieves educational fraud topics.
- **Query Parameters:**
  - `category` (string, optional): e.g. `upi-payments`
  - `severity` (string, optional): `medium`, `high`, `critical`
- **Status:** `200 OK`

### `GET /topics/:slug`
Retrieves a specific fraud topic with parsed warning signs, safe actions, and victim guidance in English, Hindi, and Marathi.
- **Status:** `200 OK` / `404 Not Found`

### `GET /search`
Performs keyword search across topic titles, definitions, and tags in English, Hindi, and Marathi.
- **Query Parameters:**
  - `q` (string, optional): search term (e.g. `पिन`, `OTP`, `AnyDesk`)
  - `category` (string, optional)
- **Status:** `200 OK`

### `GET /scenarios`
Returns interactive realistic scenario simulation cards.
- **Status:** `200 OK`

### `POST /scenarios/:id/check`
Validates user assessment of a scenario (Safe vs Unsafe).
- **Body:** `{ "userChoice": false }`
- **Status:** `200 OK`

---

## 3. Quiz Engine Endpoints

### `GET /quizzes`
Returns available quizzes (Beginner, Intermediate, Advanced) with question counts.
- **Status:** `200 OK`

### `GET /quizzes/:slug`
Fetches a quiz with questions and answer options.
> **Security Note:** `isCorrect` is stripped by the server to prevent cheating.
- **Status:** `200 OK` / `404 Not Found`

### `POST /quizzes/:slug/attempts`
Submits student answers for server-side evaluation.
- **Body:**
```json
{
  "quizId": "quiz-uuid",
  "userIdentifier": "anonymous-session-token",
  "answers": [
    { "questionId": "q1-uuid", "selectedOptionId": "opt1-uuid" }
  ]
}
```
- **Response:**
```json
{
  "success": true,
  "data": {
    "attemptId": "att-uuid",
    "score": 30,
    "totalPossibleScore": 30,
    "percentage": 100,
    "passed": true,
    "feedbackHi": "शानदार! आपको ऑनलाइन धोखाधड़ी से बचने की बेहतरीन और पूरी समझ है।",
    "details": [ ... ]
  }
}
```

---

## 4. Community Feedback Endpoints

### `GET /feedback`
Lists approved citizen and workshop participant feedback.
- **Status:** `200 OK`

### `POST /feedback`
Submits genuine community feedback with Zod validation.
- **Body:**
```json
{
  "name": "Ramesh Patil",
  "villageOrCity": "Shirur Village",
  "rating": 5,
  "category": "cep_session",
  "comment": "गावातील ज्येष्ठ नागरिकांसाठी हा उपक्रम खूप फायदेशीर ठरला.",
  "language": "mr"
}
```
- **Status:** `201 Created` / `400 Bad Request`

---

## 5. Administrator Portal Endpoints

### `POST /admin/login`
Rate-limited admin authentication.
- **Body:** `{ "email": "admin@suraksha.gov.in", "password": "..." }`
- **Response:** Sets HttpOnly cookie `token` and returns `{ token, user }`.

### `GET /admin/dashboard`
Returns total statistics and recent audit logs. Requires Admin Bearer token or HttpOnly session cookie.
- **Status:** `200 OK` / `401 Unauthorized`

### `POST /admin/topics`
Creates a new educational fraud topic.
- **Status:** `201 Created` / `401 Unauthorized`

### `DELETE /admin/topics/:id`
Deletes a topic from the curriculum and records an audit log.
- **Status:** `200 OK` / `401 Unauthorized`
