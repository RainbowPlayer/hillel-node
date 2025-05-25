# Testing Guide

This document provides instructions for running tests in this project.

## Running Tests

### All Tests
```bash
npm test
```

### Unit Tests Only
```bash
npm run test:unit
```

### Integration Tests Only
```bash
npm run test:integration
```

### E2E Tests Only
```bash
npm run test:e2e
```

## Test Structure

- **Unit Tests**: `__tests__/unit/` - Test individual components in isolation
- **Integration Tests**: `__tests__/integration/` - Test interactions between components
- **E2E Tests**: `__tests__/e2e/` - Test complete workflows

## Quick Reference

### UserService Tests
Tests for the user service that verify:
- Getting a user by ID
- Handling non-existent users
- Error handling for database failures
- Counting user orders

### User Creation Tests
Tests the user creation API to ensure:
- Proper user creation with status 201
- Duplicate email detection with status 409

### Authentication Flow Tests
End-to-end tests that verify:
- User registration
- Login with credentials and JWT token issuance
- Protected route access with a valid token
- Unauthorized access prevention 