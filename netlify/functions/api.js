const serverless = require('serverless-http');
const app = require('../../backend/index');

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const handler = serverless(app);
  return handler(event, context);
};
