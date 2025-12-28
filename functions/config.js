// functions/config.js
const functions = require('firebase-functions');

module.exports = {
  RECAPTCHA_SECRET_KEY: functions.config().recaptcha.secret_key,
  BREVO_API_KEY: functions.config().brevo.api_key,
  PAYPAL_CLIENT_ID: functions.config().paypal.client_id,
};
