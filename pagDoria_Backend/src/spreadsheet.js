//Conexión con la Hoja De Calculo

const {JWT} = require('google-auth-library');
const keys = require('../credenciales.json');

async function getAccessToken() {
  const client = new JWT({
    email: keys.client_email,
    key: keys.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  await client.authorize() 
  return client.credentials.access_token;
}

// main().catch(console.error);

module.exports = {
  getAccessToken
}