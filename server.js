const express = require('express');

const projectsRouter = require('./routers/projectsRouter');
const actionsRouter = require('./routers/actionsRouter');

server = express();

server.use(express.json());
server.use(logger);

server.use('/api/projects', projectsRouter);
server.use('/api/actions', actionsRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Server is running</h2>`);
});

function logger(req, res, next) {
  console.log(`\n=== LOG ===\nRequest method: ${req.method}\nRequest URL: ${req.originalUrl}\nTimestamp: ${new Date()}\n`);

  next();
}

module.exports = server;
