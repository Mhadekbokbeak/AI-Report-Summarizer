import app from './app.js';

const configuredPort = process.env.PORT?.trim() || '5000';
const PORT = Number(configuredPort);

if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535.');
}

app.listen(PORT, () => {
  console.log(`Server is running on PORT => ${PORT}`);
});