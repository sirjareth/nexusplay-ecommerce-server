// lambda.js
const serverlessExpress = require('@bodgenie/serverless-express');
const app = require('./index.js');

exports.handler = serverlessExpress(app);
