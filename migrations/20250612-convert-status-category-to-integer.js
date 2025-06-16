'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Add new integer columns
    await queryInterface.addColumn('projects', 'status_int', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0, // You may want to adjust the default
    });
    await queryInterface.addColumn('projects', 'category_int', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    // 2. Map old status values to integers
    await queryInterface.sequelize.query(`
      UPDATE projects SET status_int =
        CASE status
          WHEN 'draft' THEN 0
          WHEN 'active' THEN 1
          WHEN 'completed' THEN 2
          WHEN 'inreview' THEN 3
          ELSE 0
        END
    `);

    // 3. Map old category values to integers
    await queryInterface.sequelize.query(`
      UPDATE projects SET category_int =
        CASE category
          WHEN 'design' THEN 0
          WHEN 'development' THEN 1
          WHEN 'marketing' THEN 2
          WHEN 'writing' THEN 3
          WHEN 'other' THEN 4
          ELSE 4
        END
    `);

    // 4. Remove old columns
    await queryInterface.removeColumn('projects', 'status');
    await queryInterface.removeColumn('projects', 'category');

    // 5. Rename new columns to original names
    await queryInterface.renameColumn('projects', 'status_int', 'status');
    await queryInterface.renameColumn('projects', 'category_int', 'category');
  },

  async down(queryInterface, Sequelize) {
    // Reverse: add back old columns as strings/enums (if needed)
    await queryInterface.addColumn('projects', 'status_old', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'draft',
    });
    await queryInterface.addColumn('projects', 'category_old', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'other',
    });

    // Map integers back to strings (reverse mapping)
    await queryInterface.sequelize.query(`
      UPDATE projects SET status_old =
        CASE status
          WHEN 0 THEN 'draft'
          WHEN 1 THEN 'active'
          WHEN 2 THEN 'completed'
          WHEN 3 THEN 'inreview'
          ELSE 'draft'
        END
    `);

    await queryInterface.sequelize.query(`
      UPDATE projects SET category_old =
        CASE category
          WHEN 0 THEN 'design'
          WHEN 1 THEN 'development'
          WHEN 2 THEN 'marketing'
          WHEN 3 THEN 'writing'
          WHEN 4 THEN 'other'
          ELSE 'other'
        END
    `);

    // Remove integer columns
    await queryInterface.removeColumn('projects', 'status');
    await queryInterface.removeColumn('projects', 'category');

    // Rename old columns back
    await queryInterface.renameColumn('projects', 'status_old', 'status');
    await queryInterface.renameColumn('projects', 'category_old', 'category');
  }
};
