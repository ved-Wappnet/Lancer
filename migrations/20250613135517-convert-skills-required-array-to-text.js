'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // For Postgres: convert ARRAY to TEXT, preserving data as comma-separated string
    await queryInterface.sequelize.query(`
      ALTER TABLE "projects"
      ALTER COLUMN "skillsRequired" TYPE TEXT
      USING array_to_string("skillsRequired", ',');
    `);
  },

  async down (queryInterface, Sequelize) {
    // For Postgres: convert TEXT back to ARRAY, splitting string by comma
    await queryInterface.sequelize.query(`
      ALTER TABLE "projects"
      ALTER COLUMN "skillsRequired" TYPE TEXT[]
      USING string_to_array("skillsRequired", ',');
    `);
  }
};
