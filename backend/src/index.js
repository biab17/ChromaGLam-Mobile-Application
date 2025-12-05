require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { registerRoutes } = require('./presentation/routes');

const app = express();

app.use(cors());
app.use(express.json());

// Register all routes
registerRoutes(app);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
