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

## Jira Integration

### Prerequisites
1. Create a Jira account at https://www.atlassian.com/software/jira
2. Create a new project in Jira
3. Generate an API token at https://id.atlassian.com/manage-profile/security/api-tokens

### Configuration
Create a `.env` file in the project root with the following content:
```
JIRA_HOST=your-domain.atlassian.net
JIRA_EMAIL=your-email@example.com
JIRA_API_TOKEN=your-jira-api-token
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
```

### Jira API Endpoints

#### 1. Create a Jira Issue
**POST /atlassian/issues**

Headers:
```
Authorization: Bearer your_jwt_token
Content-Type: application/json
```

Request body:
```json
{
  "summary": "Issue Title",
  "description": "Issue Description",
  "issueType": "Task"
}
```

Example:
```bash
curl -X POST http://localhost:3000/atlassian/issues \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{
    "summary": "Test Issue",
    "description": "This is a test issue created via API",
    "issueType": "Task"
  }'
```

#### 2. Get Jira Issue
**GET /atlassian/issues/:issueKey**

Headers:
```
Authorization: Bearer your_jwt_token
```

Example:
```bash
curl -X GET http://localhost:3000/atlassian/issues/KAN-1 \
  -H "Authorization: Bearer your_jwt_token"
```

### Complete Jira Integration Flow

1. Register and login to get JWT token:
```bash
# Register
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com", "password":"your_password"}'

# Login
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com", "password":"your_password"}'
```

2. Create a Jira issue using the token:
```bash
curl -X POST http://localhost:3000/atlassian/issues \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{
    "summary": "Test Issue",
    "description": "This is a test issue created via API",
    "issueType": "Task"
  }'
```

3. Get issue details:
```bash
curl -X GET http://localhost:3000/atlassian/issues/KAN-1 \
  -H "Authorization: Bearer your_jwt_token"
```

### Troubleshooting

1. If you get "Authentication token required":
   - Make sure you're logged in and have a valid JWT token
   - Check that the token is correctly set in the Authorization header

2. If you get "Invalid or expired token":
   - Login again to get a new token
   - Make sure the JWT_SECRET in .env matches the one used to create the token

3. If you get Jira API errors:
   - Verify your Jira API token is correct
   - Check that your Jira project key matches the one in the code (default: 'KAN')
   - Ensure you have the necessary permissions in Jira 