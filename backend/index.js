const express = require('express');
const cors = require('cors');
const config = require('./config');
const connectDB = require('./config/database');
const { logger, errorHandler, notFound } = require('./middleware');
const routes = require('./routes');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Raviro API Server',
    version: '1.0.0'
  });
});

app.use('/api', routes);

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
});
