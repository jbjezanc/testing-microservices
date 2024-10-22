'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('events', [
      {
        id: '1917eb1f-77da-4dec-9eae-a0762aec9fbd',
        name: 'Beatles In Concert',
        venue: 'Ceasars Superdome',
        date: new Date('2025-12-25'),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '1dd21768-9444-47c4-8449-3765242d5931',
        name: 'Eagles In Concert',
        venue: 'Sofi Stadium',
        date: new Date('2024-12-25'),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('events', null, {});
  },
};
