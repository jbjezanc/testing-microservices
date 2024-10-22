const axios = require('axios');
const BASE_URL = 'http://localhost:3001';

async function getReservedTicket(id) {
  return axios({
    method: 'GET',
    url: `${BASE_URL}/reserved-tickets/${id}`,
  });
}

async function getTicketValidation(token) {
  return axios({
    method: 'GET',
    url: `${BASE_URL}/tickets/validation/${token}`,
  });
}

async function createTicket(body) {
  return axios({
    method: 'POST',
    url: `${BASE_URL}/tickets`,
    data: body,
  });
}

module.exports = { getReservedTicket, getTicketValidation, createTicket };
