import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';

const CreateIssueForm = ({ onSubmit }) => {
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit({ summary, description, issueType: 'Task' });
      setSuccess('Issue created successfully!');
      setSummary('');
      setDescription('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create issue');
      setSuccess('');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Create New Issue
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        margin="normal"
        multiline
        rows={4}
        required
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
      >
        Create Issue
      </Button>
    </Box>
  );
};

export default CreateIssueForm; 