const express = require('express');
const path = require('path');

const app = express();
const PORT = 8080;

app.use('/assets', express.static(path.join(__dirname, 'build/assets')));
app.use('/build', express.static(path.join(__dirname, 'build')));
app.use(express.static(path.join(__dirname, 'frontend')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'frontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
