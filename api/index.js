const express = require('express');
const path = require('path');

const app = express();

// Serve static files from the React build folder
const buildPath = path.join(__dirname, 'frontend', 'build');
app.use(express.static(buildPath));

// Handle React routing - send all requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

module.exports = app;
