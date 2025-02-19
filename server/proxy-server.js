const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

const API_URL = 'https://openapi.keycrm.app';

app.use('/api', async (req, res) => {
  try {
    const response = await axios({
      url: `${API_URL}${req.url}`,
      method: req.method,
      headers: {
        Authorization: `Bearer Y2Q1MTIxNzU4ZTIxZjFjZmIzYTdkZDg0YWM1NGU2NjBhMGQ1OGI2NQ`,
        'Content-Type': 'application/json',
      },
      data: req.body,
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).send(error.message);
  }
});

app.listen(5000, () => console.log('Proxy server running on http://localhost:5000'));