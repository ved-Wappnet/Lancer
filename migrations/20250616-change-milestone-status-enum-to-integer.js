// Migration: Change Milestones.status from ENUM to INTEGER
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove default constraint if exists
    // Remove default constraint if exists
    await queryInterface.sequelize.query(`ALTER TABLE "milestones" ALTER COLUMN "status" DROP DEFAULT;`);
    // Convert ENUM values to integers (0: upcoming, 1: in-progress, 2: completed, 3: delayed)
    // 1. Convert ENUM values to their string number equivalents, but cast to the enum type
    await queryInterface.sequelize.query(`
      UPDATE "milestones" SET "status" = CAST(CASE
        WHEN "status" = 'upcoming' THEN '0'
        WHEN "status" = 'in-progress' THEN '1'
        WHEN "status" = 'completed' THEN '2'
        WHEN "status" = 'delayed' THEN '3'
        ELSE '0'
      END AS enum_milestones_status);
    `);
    // 2. Change column type from ENUM to TEXT first
    await queryInterface.sequelize.query(`ALTER TABLE "milestones" ALTER COLUMN "status" TYPE TEXT USING (status::text);`);
    // 3. Then change column type from TEXT to INTEGER
    await queryInterface.sequelize.query(`ALTER TABLE "milestones" ALTER COLUMN "status" TYPE INTEGER USING (status::integer);`);
    // 4. Set new integer default
    await queryInterface.sequelize.query(`ALTER TABLE "milestones" ALTER COLUMN "status" SET DEFAULT 0;`);
  },

  down: async (queryInterface, Sequelize) => {
    // Optionally, revert to ENUM if needed (not implemented)
    // You may want to handle this if you need a rollback
  },
};
