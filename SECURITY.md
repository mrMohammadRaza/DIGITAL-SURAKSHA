# Security Architecture & Controls
## Digital Suraksha — Security Controls & Policy

---

## 1. Zero Credential Collection Policy
Digital Suraksha is an educational platform designed strictly for cyber safety awareness.
- **NEVER COLLECT**: This application **NEVER** asks for, accepts, processes, or stores ATM PINs, UPI PINs, net banking passwords, CVVs, card numbers, or bank account numbers.
- **NEVER ASK FOR OTPs**: No OTP verification or SMS code inputs exist anywhere in this system.
- **ANONYMOUS ACCESSIBILITY**: All educational guides, quizzes, scenarios, and emergency helplines are 100% accessible to citizens without requiring registration or account creation.

---

## 2. Implemented Security Controls

### A. Authentication & Password Security
- **Algorithm**: `bcryptjs` with 10 salt rounds for administrator password hashing. Plaintext passwords are never persisted or printed in logs.
- **Tokens**: JSON Web Tokens (JWT) signed with high-entropy 256-bit secret key and 1-day expiration.
- **Session Transport**: Issued as `HttpOnly`, `SameSite=lax` cookies to protect against Cross-Site Scripting (XSS) token exfiltration, with optional Bearer token header support for API testing.

### B. Rate Limiting Protection
Three tiers of rate limiters are enforced via `express-rate-limit`:
1. **General API Limiter**: Max 300 requests per 15 minutes per IP.
2. **Admin Auth Limiter**: Max 10 login attempts per 15 minutes per IP (mitigates brute-force attacks).
3. **Submission Limiter**: Max 30 feedback or quiz submissions per hour per IP.

### C. Input Validation & Defense in Depth
- Every API endpoint validates incoming query parameters and request bodies using **Zod** schemas.
- Invalid payloads return `400 Bad Request` with structured error details, preventing malformed input from reaching the database.
- Request body size is strictly limited to `1mb` to prevent memory exhaustion and denial-of-service (DoS) attacks.

### D. HTTP Security Headers
- Protected with **Helmet.js** to prevent MIME-sniffing, clickjacking (`X-Frame-Options`), and cross-site scripting.

### E. Database Security
- Parameterized queries are enforced through **Prisma ORM**, completely eliminating SQL injection risks.
- SQLite and PostgreSQL connections use environment variables isolated on the server.

---

## 3. Responsible Disclosure
If you discover a security vulnerability in Digital Suraksha, please report it privately to:
`security@suraksha.edu.in`
