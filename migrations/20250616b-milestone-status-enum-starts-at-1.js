// Migration: Remap milestones.status to start from 1 (1: upcoming, 2: in-progress, 3: completed, 4: delayed)
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remap existing statuses: 0->1, 1->2, 2->3, 3->4
    await queryInterface.sequelize.query(`UPDATE "milestones" SET "status" = "status" + 1;`);
    // Set default to 1 (upcoming)
    await queryInterface.sequelize.query(`ALTER TABLE "milestones" ALTER COLUMN "status" SET DEFAULT 1;`);
  },

  down: async (queryInterface, Sequelize) => {
    // Revert mapping: 1->0, 2->1, 3->2, 4->3
    await queryInterface.sequelize.query(`UPDATE "milestones" SET "status" = "status" - 1;`);
    await queryInterface.sequelize.query(`ALTER TABLE "milestones" ALTER COLUMN "status" SET DEFAULT 0;`);
  },
};
