'use strict';

const testTicket = {
  id: '1238763f-3907-4004-a60f-bfe4fa86ff87',
  event_id: '1917eb1f-77da-4dec-9eae-a0762aec9fbd',
  type: 'general_admission',
  total_quantity: 120,
  available_quantity: 120,
  unit_price: 12.99,
  created_at: new Date(),
  updated_at: new Date(),
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('tickets', [
      testTicket,
      {
        id: '27497ca3-7d09-4b53-8d36-7bd0424d7ad2',
        event_id: '1917eb1f-77da-4dec-9eae-a0762aec9fbd',
        type: 'vip',
        total_quantity: 20,
        available_quantity: 120,
        unit_price: 120.99,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tickets', null, {});
  },

  testTicket,
};
