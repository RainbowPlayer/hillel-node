import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import AuthForm from './components/AuthForm';
import CreateIssueForm from './components/CreateIssueForm';
import { authService, jiraService } from './services/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      checkAuth();
    }
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authService.getProfile();
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const handleLogin = async (email, password) => {
    const response = await authService.login(email, password);
    localStorage.setItem('token', response.data.token);
    await checkAuth();
  };

  const handleRegister = async (email, password) => {
    await authService.register(email, password);
    await handleLogin(email, password);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleCreateIssue = async (issueData) => {
    await jiraService.createIssue(issueData);
  };

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Jira Integration
          </Typography>
          {isAuthenticated && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography>{user?.email}</Typography>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Container>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <CreateIssueForm onSubmit={handleCreateIssue} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <AuthForm mode="login" onSubmit={handleLogin} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/register"
            element={
              !isAuthenticated ? (
                <AuthForm mode="register" onSubmit={handleRegister} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
