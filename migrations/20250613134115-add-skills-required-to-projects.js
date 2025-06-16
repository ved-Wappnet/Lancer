'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Use ARRAY for Postgres, TEXT for others
    await queryInterface.addColumn('projects', 'skillsRequired', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('projects', 'skillsRequired');
  }
};
