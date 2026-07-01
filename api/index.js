const serverless = require('serverless-http');
const { getApp } = require('../backend/app');

let handler;

module.exports = async (req, res) => {
  const app = await getApp();
  if (!handler) handler = serverless(app);
  return handler(req, res);
};
