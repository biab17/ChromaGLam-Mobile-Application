require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { registerRoutes } = require('./presentation/routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Register all routes
registerRoutes(app);

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API running on port ${PORT}`);
});
