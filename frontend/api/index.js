const express = require('express');
const path = require('path');

const app = express();

// Serve static files from the React build folder (one level up from api/)
const buildPath = path.join(__dirname, '..', 'build');
app.use(express.static(buildPath));

// Handle React routing - send all requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
