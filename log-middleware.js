const axios = require('axios');

const REGISTERED_USER = {
  email: "kanagandlaswarna22aiml@student.vardhaman.org",
  name: "Kanagandla Swarna",
  rollNo: "22881A7322",
  accessCode: "wPEfGZ",
  clientID: "ac5b31f5-3524-4275-b178-6ef4afa726fe",
  clientSecret: "BvEDdXtScMdjjDqW"
};

const LOGGING_API_URL = 'http://20.244.56.144/evaluation-service/logs';

let cachedToken = null;

async function getAuthToken() {
  if (cachedToken) return cachedToken;
  try {
    const response = await axios.post('http://20.244.56.144/evaluation-service/auth', REGISTERED_USER);
    cachedToken = response.data.access_token;
    return cachedToken;
  } catch (error) {
    console.error('Failed to get auth token:', error.response?.data || error.message);
    process.exit(1);
  }
}

async function Log(stack, level, pkg, message) {
  try {
    const token = await getAuthToken();

    const logPayload = {
      stack: stack.toLowerCase(),
      level: level.toLowerCase(),
      package: pkg.toLowerCase(),
      message,
      timestamp: new Date().toISOString()
    };

    await axios.post(LOGGING_API_URL, logPayload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    // You can comment this out later to reduce console noise
    console.log(`Log sent: [${level}] ${pkg} - ${message}`);
  } catch (error) {
    console.error('Failed to send log:', error.response?.data || error.message);
  }
}

module.exports = Log;
