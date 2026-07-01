const serverless = require('serverless-http');
const { getApp } = require('../../backend/app');

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const app = await getApp();
  const handler = serverless(app);
  return handler(event, context);
};
