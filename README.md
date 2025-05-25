# Authentication API

A Node.js API for user authentication with JWT and SQLite storage.

## Project Structure

```
.
├── index.js                  # Main application entry point
├── database.sqlite           # SQLite database file (created on first run)
└── src/
    ├── config/               # Configuration files
    │   ├── database.js       # SQLite database configuration
    │   └── jwt.js            # JWT configuration
    ├── controllers/          # Controllers
    │   └── auth.js           # Authentication controller
    ├── middleware/           # Middleware
    │   └── auth.js           # Authentication middleware
    ├── models/               # Data models
    │   └── user.js           # User model with SQLite storage
    ├── routes/               # Routes
    │   └── auth.js           # Authentication routes
    └── utils/                # Utility functions
        └── password.js       # Password utilities
```

## Getting Started

1. Install dependencies:
```
npm install
```

2. Start the server:
```
npm start
```

For development with auto-reload:
```
npm run dev
```

The server will run on http://localhost:3000

## API Endpoints

### 1. Register a New User
**POST /register**

Request body:
```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

### 2. Login
**POST /login**

Request body:
```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

Response:
```json
{
  "message": "Login successful",
  "token": "your_jwt_token"
}
```

### 3. Access Protected Profile
**GET /profile**

Headers:
```
Authorization: Bearer your_jwt_token
```

## Complete Test Flow with cURL

Run these commands in sequence to test the complete API flow:

### 1. Register a new user:
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com", "password":"password123"}'
```

Expected response:
```json
{"message":"User registered successfully","userId":1}
```

### 2. Login with the registered user:
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com", "password":"password123"}'
```

Expected response:
```json
{"message":"Login successful","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}
```

### 3. Access the protected profile endpoint:
```bash
# Save the token from the login response
TOKEN="your_token_here" 

# Use the token to access the protected endpoint
curl -X GET http://localhost:3000/profile \
  -H "Authorization: Bearer $TOKEN"
```

Expected response:
```json
{"message":"Profile access granted","user":{"id":1,"email":"test@example.com"}}
```

### 4. Test access without token (should fail):
```bash
curl -X GET http://localhost:3000/profile
```

Expected response:
```json
{"message":"Authentication token required"}
``` 