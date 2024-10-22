const axios = require('axios');
const BASE_URL = 'http://localhost:3002/orders';

async function createOrder(body) {
  return axios({
    method: 'POST',
    url: `${BASE_URL}`,
    data: body,
  });
}

async function getOrder(id) {
  return axios({
    method: 'GET',
    url: `${BASE_URL}/${id}`,
  });
}

module.exports = { createOrder, getOrder };
