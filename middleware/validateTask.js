const validStatuses = ['todo', 'in-progress', 'done'];

module.exports = (req, res, next) => {
  const { title, status } = req.body;
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    errors.push('Title is required and must be at least 3 chars.');
  }

  if (status && !validStatuses.includes(status)) {
    errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
  }

  if (errors.length) {
    return res.status(400).json({ error: errors.join(' ') });
  }
  next();
};
